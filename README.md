lerna用于管理多`package`，且各`package`可能会互相引用的项目。

`lerna`通过两种方式管理子项目的版本号：

Fixed/Locked mode (default)：每次执行`lerna publish`都会将所涉及到的包升级到最新一个版本，开发者只需要确定发布下一个`version`。
Independent mode：由开发者自行管理子项目的`version`，每次执行`lerna publish`都需要确定每个包的下个版本号。

基本使用

以下命令以`yarn`为主。

Install 安装

`yarn global add lerna`

Init 初始化项目

`lerna init`
命令执行完毕后，会在生成对应的目录结构。

```
lerna-repo/
  package.json
  lerna.json
  packages/
    package-1/
      package.json
    package-2/
      package.json
```

Lerna.json 配置

```
{
  "version": "1.1.3", // 项目版本
  "npmClient": "npm", // 默认使用的npm，可改为yarn
  "command": { // lerna 内置命令的配置
    "publish": {
      "ignoreChanges": ["*.md", "**/test/**",], // 发布时忽略部分文件的改动，配置此项可以减少不必要的publish。
      "message": "chore(release): publish" // git commit message
    },
  },
  "packages": ["packages/*"]
}
```
Create 创建子项目

`lerna create <name>`

创建一个子项目，并会根据交互提示生成对应的`package.json`

Add 添加依赖

`lerna add <package>[@version] [--dev] [--exact]`

`lerna add eslint`： 所有包都会装上eslint。


`lerna add eslint --scope=package1`：只有`package1`会装上。

`lerna add eslint packages/prefix-*`：符合`prefix`的包会装上。

options:

`-dev`：添加到`devDependencies`

`--exact`: 只安装特定版本

如果添加的是子项目，则会通过link软连接到对应的项目中。

`lerna add package1 --scope=package2`

Run 执行npm script命令

`lerna run <script> -- [..args]`

`lerna run test`：则会执行所有子项目中的`test`。


`lerna run --scope package1 test`：只执行`package1`中的`test`。

`lerna run --ignore package-* test`：只执行除了匹配`package-*`外的项目中的`test`

Exec 执行任意命令

`lerna exec -- <command> [..args]`

与lerna run类似，只不过它可以执行任意命令。

`eg: lerna exec -- rm -rf ./node_modules`

其他命令

`lerna bootstrap`：安装各子项目依赖，对相互引用的项目进行软连接，在子项目中执行`npm run prepublish`和`npm run prepare`

`--hoist [glob]`：会将子项目的匹配的依赖`(eg：eslint, jest等)`，统一放在根目录的`node_modules`中，减少安装时间，但仅限`npmClient=npm`

`—nohoist [glob]`: 匹配的依赖`(eg: babel)`会安装到子项目中的`node_modules`中

`lerna clean`：删除子项目的`node_modules`

`lerna link`：同`bootstrap`第二步。
