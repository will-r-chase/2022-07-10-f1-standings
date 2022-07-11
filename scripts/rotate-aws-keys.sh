#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "Usage: yarn rotate-aws-keys --profiles profile1,profile2"
  printf "Rotate your AWS keys, creating a new set, and deleting the old.\n\n"
  echo "This script will:"
  echo "- Backup your current ~/.aws/credentials file."
  echo "- Delete any access keys you have on your AWS account."
  echo "- Generate a new set of access keys and write them to your ~/.aws/credentials file."
  printf "You must have proper AWS account permissions to rotate your own keys.\n\n"
  echo "Examples:"
  echo "Rotate your default profile"
  echo "yarn rotate-aws-keys"
  echo "Rotate you default profile and don't prompt"
  echo "yarn rotate-aws-keys -y"
  echo "Rotate multiple profiles (if you have them)"
  echo "yarn rotate-aws-keys --profiles root,media"
}

main() {
  check_programs

  while [[ $# -gt 0 ]]; do
    key="$1"

    case $key in
      -p | --profiles)
        profiles="$2"
        shift
        shift
        ;;
      -y | --yes)
        yes=true
        shift
        ;;
      -h | --help)
        usage
        exit 0
        ;;
      *)
        err "$key is not a valid argument."
        usage
        exit 1
        ;;
    esac
  done

  profiles="${profiles:-default}"
  yes="${yes:-false}"

  info_warning "This will delete your AWS access keys in the $profiles profile(s) and"
  info_warning "replace them with new keys."

  if [ "$yes" == "false" ]; then
    read -p "Are you sure you want to continue? [y/n] " -r

    if ! [[ ${REPLY:-} =~ ^[Yy]$ ]]; then
      printf "Not generating new keys. Exiting.\n"
      exit 0
    fi
  fi

  IFS=',' read -ra profiles_array <<<"$profiles"

  info "Backing up current ~/.aws/credentials file."
  backup_date=$(backup_aws_credentials)

  for profile in "${profiles_array[@]}"; do
    current_keys=$(aws iam list-access-keys --output json --profile "$profile")
    number_of_keys=$(echo "$current_keys" | jq '.AccessKeyMetadata | length')
    if [ "$number_of_keys" -gt 1 ]; then
      err "There is more than one key attached to your user in the $profile profile. You must only have one key attached to your user to use this script."
      delete_aws_credentials_backup "$backup_date"
      exit 1
    fi

    info "Creating new key in the $profile profile."
    create_new_aws_key "$profile"
    info "Checking for availability of new key in the $profile profile."
    wait_for_new_aws_key "$backup_date" "$profile"
    info "New key created in the $profile profile."

    info "Deleting old key from the $profile profile."
    aws iam delete-access-key --access-key-id "$(echo "$current_keys" | jq -r '.AccessKeyMetadata[].AccessKeyId')" --profile "$profile"
    info "Old key deleted from the $profile profile."
  done

  rm ~/.aws/credentials_"$backup_date"
  info "Backup at ~/.aws/credentials_$backup_date deleted."

  info_arrow "Successfully rotated your AWS keys."
  info_arrow "Your new keys are in your ~/.aws/credentials file."
}

backup_aws_credentials() {
  local backup_date
  backup_date=$(date +%Y-%m-%d-%H-%M-%S)

  cp ~/.aws/credentials ~/.aws/credentials_"$backup_date"
  echo "$backup_date"
}

delete_aws_credentials_backup() {
  local backup_date
  backup_date="$1"

  rm ~/.aws/credentials_"$backup_date"
}

create_new_aws_key() {
  local profile
  profile="$1"

  new_key=$(aws iam create-access-key --profile "$profile")
  aws configure set aws_access_key_id "$(echo "$new_key" | jq -r '.AccessKey.AccessKeyId')" --profile "$profile"
  aws configure set aws_secret_access_key "$(echo "$new_key" | jq -r '.AccessKey.SecretAccessKey')" --profile "$profile"
}

wait_for_new_aws_key() {
  local backup_date
  backup_date="$1"
  local profile
  profile="$2"

  for i in {1..10}; do
    # shellcheck disable=SC2015
    error=$(aws iam list-access-keys --profile "$profile" 2>&1 1>/dev/null) && break || sleep 2
    info "Checking for availability of new key in the $profile profile, try $((i + 1))/10."
  done
  if [ "$error" ]; then
    echo "$error" >&2
    info "Restoring old credentials from ~/.aws/credentials_${backup_date}"
    cp ~/.aws/credentials_"$backup_date" ~/.aws/credentials
    exit 1
  fi
}

check_programs() {
  for program in aws jq; do
    if ! command -v "$program" &>/dev/null; then
      err "You must have $program installed to use this script."
      exit 1
    fi
  done
}

err() {
  red=$'\e[1;31m'
  end=$'\e[0m'
  printf "%s\n\n" "${red}${1}${end}"
}

info_arrow() {
  printf "\e[1;32m==>\e[0m %s\n" "$1"
}

info_warning() {
  printf "\e[1;33m==>\e[0m %s\n" "$1"
}

info() {
  printf "=== %s\n" "$1"
}

main "$@"
