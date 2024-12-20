// // /** @type {import('ts-jest').JestConfigWithTsJest} **/
// // module.exports = {
// //   testEnvironment: "jest-environment-jsdom",
// //   transform: {
// //     "^.+\\.(ts|tsx)$": "babel-jest"
// //   },
// //   // moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
// //   // setupFilesAfterEnv: ["<rootDir>/node_modules/@testing-library/jest-dom/extend-expect"],
// //   // moduleNameMapper: {
// //   //   "\\.(css|less|scss|sass)$": "identity-obj-proxy"
// //   // }

// // };
module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '\\.[jt]sx?$': 'esbuild-jest',
    },
}