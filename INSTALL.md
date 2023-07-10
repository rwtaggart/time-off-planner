# INSTALL
Here's how to recreate this project.

## References
https://reactjs.org/docs/create-a-new-react-app.html#create-react-app
https://mui.com/

## Create a new project
```sh
npx create-react-app vacation-planner
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material @mui/x-date-pickers dayjs
npm start
```

## Modify templates
1. Change `public/index.html`
    - Modify `<title>`
    - Download a new favicon SVG into `./public`:
        https://mui.com/components/material-icons/?query=arch
        https://fonts.google.com/icons?icon.query=arch
    - Update `public/index.html` with new favicon.svg link
        e.g., `<link rel="icon" href="%PUBLIC_URL%/add_circle_white_24dp.svg" />`

1. Modify `src/App.js` and `src/App.css`
1. Add `toolbar` and modify theme

