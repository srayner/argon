import PropTypes from "prop-types";
import Link from "next/link";
import styles from "./button.module.css";

const Button = ({ size, color, type, children, onClick, href }) => {
  const getSizeClass = (size) => {
    switch (size) {
      case "small":
        return styles.btnSmall;
      case "medium":
        return styles.btnMedium;
      case "large":
        return styles.btnLarge;
      default:
        return "";
    }
  };

  const getColorClass = (color) => {
    switch (color) {
      case "primary":
        return styles.btnPrimary;
      case "secondary":
        return styles.btnSecondary;
      case "danger":
        return styles.btnDanger;
      default:
        return "";
    }
  };

  const buttonClasses = `${styles.btn} ${getSizeClass(size)} ${getColorClass(
    color
  )}`;

  return href ? (
    <Link href={href} className={buttonClasses}>
      {children}
    </Link>
  ) : (
    <button className={buttonClasses} type={type} onClick={onClick}>
      {children}
    </button>
  );
};

Button.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  color: PropTypes.oneOf(["primary", "secondary", "danger"]),
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  href: PropTypes.string,
};

Button.defaultProps = {
  size: "medium",
  color: "primary",
  type: "button",
  onClick: () => {},
  href: null,
};

export default Button;
