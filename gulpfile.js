"use strict";
const colors = require("ansi-colors");
const gulp = require("gulp");
const log = require("fancy-log");
const minimist = require("minimist");
const shell = require("gulp-shell");
const inquirer = require("inquirer");
const exec = require('child_process').exec;
const createCsvWriter = require('csv-writer').createObjectCsvWriter; 

const projectConfig = require("./project.config.json");
// const { fs } = require("prettier");
const fs = require("fs-extra");
const { scaleOrdinal } = require("d3-scale");
const { write } = require("jimp");
const prodUrl = `https://${projectConfig.s3.bucket}/${projectConfig.s3.folder}/index.html`;
const date = new Date();
const timestamp = {
  year: date.getFullYear(),
  month: (date.getMonth() < 10 ? "0" : "") + (date.getMonth() + 1),
  date: (date.getDate() < 10 ? "0" : "") + date.getDate(),
  hour: (date.getHours() < 10 ? "0" : "") + date.getHours(),
  min: (date.getMinutes() < 10 ? "0" : "") + date.getMinutes(),
  sec: (date.getSeconds() < 10 ? "0" : "") + date.getSeconds(),
};

const slugifyItem = (str) => {
  let outString = str.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(' ', '')
  return outString; 
}

const csvWriter = createCsvWriter({
  path: 'public/fallbacks/reference.csv',
  header: [
      {id: 'batch', title:'Batch'},
      {id: 'embed', title: 'Embed'},
      {id: 'social', title: 'Social'}
  ]
});

const defaultOptions = {
  string: "port",
  default: {
    port: 3000,
  },
  alias: {
    p: "port",
  },
};
const argv = minimist(process.argv.slice(2), defaultOptions);

// Push
gulp.task(
  "push",
  shell.task(
    [
      "git add -A .",
      `git commit -am "latest as of ${timestamp.year}-${timestamp.month}-${timestamp.date} ${timestamp.hour}:${timestamp.min}:${timestamp.sec}"`,
      "git push",
    ],
    {
      ignoreErrors: true,
    }
  )
);
gulp.task("push").description = "Push any unstaged commits to Github";

// Build
gulp.task("build", shell.task("npm run build"));
gulp.task("build").description =
  "Compile all your code, styles, and assets to the public directory";

// Deploy
gulp.task(
  "deploy",
  shell.task(
    `aws s3 cp public s3://${projectConfig.s3.bucket}/${projectConfig.s3.folder} --recursive --metadata-directive REPLACE --cache-control max-age=30,public --acl public-read`
  )
);
gulp.task("deploy").description =
  "Upload the public direcotry to visuals.axios.com on AWS S3";

// Log publish
gulp.task("log:publish", (done) => {
  log("");
  log(
    "🎉 ",
    colors.green.bold(
      "Your project can be accessed and embedded using the following url:"
    )
  );
  log(`\t${prodUrl}`);
  log("");
  log("👉 ", colors.blue.bold("Login to the Axios CMS:"));
  log("\thttps://eden.axios.com/dashboard");
  log("");
  done();
});
gulp.task("log:publish").description = "Output the URL to your terminal";

// Preview
gulp.task(
  "preview",
  shell.task([
    `echo ${prodUrl} | pbcopy`,
    'echo "\ncopied to your clipboard:"',
    `echo "${prodUrl}\n"`,
    `open ${prodUrl}`,
  ])
);
gulp.task("preview").description =
  "Open a browser tab to the visual and copy the URL to your clipboard";

// Fallbacks
gulp.task("fallbacks", shell.task("npm run fallbacks"));
gulp.task("fallbacks").description =
  "Generate fallback images to src/fallbacks";

// batch fallbacks
gulp.task("batch-fallbacks", shell.task("npm run batch-fallbacks"));
gulp.task("batch-fallbacks").description =
    "Generate fallback images to src/fallbacks";

// Push fallbacks
gulp.task(
  "push-fallbacks",
  shell.task(
    [
      "git add -A .",
      `git commit -am "fallbacks created ${timestamp.year}-${timestamp.month}-${timestamp.date} ${timestamp.hour}:${timestamp.min}:${timestamp.sec}"`,
      "git push",
    ],
    {
      ignoreErrors: true,
    }
  )
);
gulp.task("push-fallbacks").description =
  "Push newly created fallbacks to Github";

// Publish (push, build, deploy, log publish, preview)
gulp.task("publish", (done) => {
  inquirer
    .prompt([
      {
        type: "confirm",
        message: "Create new fallbacks?",
        default: false,
        name: "fallbacks",
      },
    ])
    .then((answers) => {
      if (answers.fallbacks) {
        gulp.series(
          "fallbacks",
          "push-fallbacks",
          "build",
          "deploy",
          "log:publish",
          "preview"
        )();
      } else {
        gulp.series("push", "build", "deploy", "log:publish", "preview")();
      }
      done();
    });
});
gulp.task("publish").description =
  "A series of commands which publishes a visual to AWS S3";

gulp.task("aws-publish-batch", (done) => {
  for (const item of projectConfig.project.series) { 
    exec(`aws s3 cp public/build s3://${projectConfig.s3.bucket}/${projectConfig.s3.folder}-${slugifyItem(item)}/build --recursive --metadata-directive REPLACE --cache-control max-age=30,public --acl public-read`, function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
    });
    exec(`aws s3 cp public/favicon.png s3://${projectConfig.s3.bucket}/${projectConfig.s3.folder}-${slugifyItem(item)}/favicon.png --metadata-directive REPLACE --cache-control max-age=30,public --acl public-read`, function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
    });
    exec(`aws s3 cp public/global.css s3://${projectConfig.s3.bucket}/${projectConfig.s3.folder}-${slugifyItem(item)}/global.css --metadata-directive REPLACE --cache-control max-age=30,public --acl public-read`, function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
    });
    exec(`aws s3 cp public/html/index-${slugifyItem(item)}.html s3://${projectConfig.s3.bucket}/${projectConfig.s3.folder}-${slugifyItem(item)}/index.html --metadata-directive REPLACE --cache-control max-age=30,public --acl public-read`, function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
    });
    exec(`aws s3 cp public/fallbacks/${slugifyItem(item)} s3://${projectConfig.s3.bucket}/${projectConfig.s3.folder}-${slugifyItem(item)}/fallbacks --recursive --metadata-directive REPLACE --cache-control max-age=30,public --acl public-read`, function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
    });
  }
  done();
})

gulp.task("write-batch-csv", (done) => {
  const records = []; 
  for (const item of projectConfig.project.series) {
    let obj = {
      "batch": `${item}`,
      "embed": `https://${projectConfig.s3.bucket}/${projectConfig.s3.folder}-${slugifyItem(item)}/index.html?${projectConfig.project.queryStringVar}=${item}`, 
      "social": `https://${projectConfig.s3.bucket}/${projectConfig.s3.folder}-${slugifyItem(item)}/fallbacks/${projectConfig.project.slug}-${slugifyItem(item)}-social.png`
    }
    records.push(obj)
  }
  csvWriter.writeRecords(records)
    .then(() => {
        console.log('Wrote batch CSV!');
    });
  done();
})

gulp.task('create-folders', (done) => {
  exec(`mkdir public/fallbacks`)
  for (const item of projectConfig.project.series) {
    exec(`mkdir public/fallbacks/${slugifyItem(item)}`, function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
    });
  }
  exec(`mkdir public/html`)
  console.log('folders created!')
  done();
})

gulp.task('create-new-pages', (done) => {
  exec(`rm /public/html*`)
  for (const item of projectConfig.project.series) {
    exec(`touch public/html/index-${slugifyItem(item)}.html; cp public/index-batch.html public/html/index-${slugifyItem(item)}.html`, function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
    });
    exec(`sed -i '' 's/slugNew/${projectConfig.project.slug}-${slugifyItem(item)}/g' public/html/index-${slugifyItem(item)}.html`, function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
    });
    exec(`sed -i '' 's/slugApple.png/${projectConfig.project.slug}-${slugifyItem(item)}-apple.png/g' public/html/index-${slugifyItem(item)}.html`, function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
    });
    exec(`sed -i '' 's/slugFallback.png/${projectConfig.project.slug}-${slugifyItem(item)}-fallback.png/g' public/html/index-${slugifyItem(item)}.html`, function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
    });
  }
  done();
})

gulp.task("publish-batch", (done) => {
  inquirer
    .prompt([
      {
        type: "confirm",
        message: "Create new fallbacks?",
        default: false,
        name: "fallbacks",
      },
    ])
    .then((answers) => {
      if (answers.fallbacks) {
        gulp.series(
          "create-folders",
          "batch-fallbacks",
          "build",
          "create-new-pages",
          "aws-publish-batch",
          "write-batch-csv"
        )();
      } else {
        gulp.series(
          "create-folders",
          "build",
          "create-new-pages",
          "aws-publish-batch",
          "write-batch-csv"
        )();
      }
    done();
  });
})
