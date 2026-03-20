import monkeyLogo from "@/assets/monkey-logo.png";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  textClassName?: string;
  /** Use "icon" for header/footer (favicon), "full" for hero (monkey logo) */
  variant?: "icon" | "full";
}

const sizes = {
  sm: "h-14",
  md: "h-16",
  lg: "h-44",
};

const Logo = ({ size = "sm", showText = false, textClassName = "text-foreground", variant = "full" }: LogoProps) => (
  <div className="flex items-center gap-2.5">
    <img
      src={variant === "icon" ? "/favicon.ico" : monkeyLogo}
      alt="Digital Moonkey Travel"
      className={`${sizes[size]} object-contain`}
    />
    {showText && (
      <span className={`font-bold text-lg tracking-tight ${textClassName}`}>
        Digital Moonkey Travel
      </span>
    )}
  </div>
);

export default Logo;
