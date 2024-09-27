// Deklarasi Tipe untuk File SCSS from 'import styles from "./Register.modules.scss";'
declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}
