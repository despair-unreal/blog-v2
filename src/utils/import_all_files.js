// 批量导入指定文件夹下的所有组件
export function importAllfiles(files) {
  const path = require('path');
  // 批量导入文件
  // keys(): 返回匹配成功模块的名字组成的数组
  let modules = {};
  files.keys().forEach(key => {
    // 文件
    const file = files(key);
    // 提取文件名作为组件名
    const name = path.basename(key, path.extname(key));
    modules[name] = file.default || file;
  });
  return modules;
}
