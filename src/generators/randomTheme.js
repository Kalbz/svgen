import { themeChange } from 'theme-change';


export function randomTheme(){

    const themes = ["dark",/*"light","cupcake","bumblebee","emerald","corporate","synthwave","retro","cyberpunk","valentine","halloween","garden","forest","aqua","lofi","pastel","fantasy","wireframe","black","luxury","dracula","cmyk","autumn","business","acid","lemonade","night","coffee","winter","dim","nord","sunset","caramellatte","abyss","silk"*/];

    const random = themes[Math.floor(Math.random() * themes.length)];
    document.documentElement.setAttribute('data-theme', random);
    localStorage.setItem('theme', random);

    themeChange();

}

