// Next declares *.module.css but not a plain stylesheet, and TypeScript 7 stopped
// tolerating a side-effect import it cannot resolve (TS2882).
declare module "*.css";
