npm install lerna -g

lerna init

yarn install

private:true and "workspaces": ["packages/*"],

lerna create xxx 创建子项目

yarn workspaces info 查看

yarn add xxx -W || yarn add xxx --ignore-workspace-root-check 添加公共依赖

yarn workspace project-name(子项目名) add xxx(dependency) 给子项目添加依赖

learn add xxx(依赖名) 给 packages 下的每个子项目都添加依赖

lerna add xxx(依赖名字) --scope project-name(子项目名) 只给这一个子项目的添加依赖
