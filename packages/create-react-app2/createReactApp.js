const chalk = require("chalk");
const path = require("path");
const { Command } = require("commander");
const fs = require("fs-extra");
const packageJson = require("./package.json");
const spawn = require("cross-spawn");

async function init() {
  console.log(process.argv);
  let projectName;
  new Command(packageJson.name)
    .version(packageJson.version)
    .arguments("<project-directory>")
    .usage(`${chalk.green("<project-directory>")}`)
    .action((name) => {
      projectName = name;
    })
    .parse(process.argv);
  console.log(projectName);
  await createApp(projectName);
}

async function createApp(name) {
  const root = path.resolve(name); // 得到将要生成文件夹的绝对路径
  const appName = path.basename(root); // 获取文件名
  fs.ensureDirSync(name); // 确保当前目录是存在的。不存在则创建
  console.log(root, appName, process.cwd());

  console.log(`Creating a new React app in ${chalk.green(root)}.`);

  const packageJson = {
    name: appName,
    version: "0.1.0",
    private: true,
  };

  // 写入package.json
  fs.writeFileSync(
    path.join(root, "package.json"), // 写入路径
    JSON.stringify(packageJson, null, 2) // 写入内容
  );

  const originalDirectory = process.cwd();
  process.chdir(root);

  await run(root, appName, originalDirectory);
}

/**
 *
 * @param {*} root 创建项目的路径
 * @param {*} appName 项目名
 * @param {*} originalDirectory 原始的工作目录
 */
async function run(root, appName, originalDirectory) {
  const scriptName = "react-scripts";
  const templateName = "cra-template";
  const allDependencies = ["react", "react-dom", scriptName, templateName];

  console.log("Installing packages. This might take a couple of minutes.");

  console.log(
    `Installing ${chalk.cyan("react")}, ${chalk.cyan(
      "react-dom"
    )}, and ${chalk.cyan(scriptName)}${` with ${chalk.cyan(templateName)}`}...`
  );

  await install(root, allDependencies);

  // 项目根目录  项目的名字  verbose是否显示详细信息  原始的目录  模板名称
  let data = [root, appName, true, originalDirectory, templateName];
  // argv[1]拿到的就是data
  let source = `
    var init = require("${scriptName}/scripts/init.js");
    init.apply(null, JSON.parse(process.argv[1]));
  `;

  await execNodeScript({ cwd: process.cwd() }, data, source);
  console.log("Done");
  process.exit(0);
}

async function execNodeScript({ cwd }, data, source) {
  return new Promise((resolve) => {
    const child = spawn(
      process.execPath, // node可执行文件路径
      ["-e", source, "--", JSON.stringify(data)],
      { cwd, stdio: "inherit" }
    );
    // === 比如 node -e 'console.log(1)' 他就会执行这个js脚本
    // 在这可以理解为 node -e source脚本 -- "[参数]" node会把参数传给source这个执行脚本。
    child.on("close", resolve);
  });
}

async function install(root, allDependencies) {
  return new Promise((resolve) => {
    const command = "yarn";
    const args = ["add", "--exact", ...allDependencies, "--cwd", root];
    // 开启子进程下载依赖。--exact精确下载。 --cwd添加依赖的路径
    const child = spawn(command, args, { stdio: "inherit" });
    child.on("close", resolve);
  });
}

module.exports = {
  init,
};
