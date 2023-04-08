// function SchemaToTemplateParser(schema) {
//   let body =
//     "#set($currRoot = $input.path('$')) \n" +
//     '#set($isValid = true)\n' +
//     '#set($errorMessage = "")\n';
//
//   let root = "$currRoot";
//
//   return body + helper(root, schema);
// }
//
// function helper(root, variable): string {
//   switch (variable.type) {
//     case 'object':
//       let root = '';
//       return objectToTemplate(currRoot);
//     case:
//   }
//
// }
//
// function objectToTemplate(root, obj: object) {
//   const keys = Object.keys(obj);
//
//   keys.forEach((key) => {
//
//   });
// }
