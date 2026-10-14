export default function Button({ children, className = '', ...props }) {
  return <button className={'portfolio-button ' + className} type="button" {...props}>{children}</button>;
}
