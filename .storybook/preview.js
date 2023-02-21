import "./index.css"
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const globalTypes = {
  githubURL: {
    name: "githubURL",
    description: "Global url",
    defaultValue: "https://github.com/KorieDrakeChaney/ThreeComponents",
  },
};
