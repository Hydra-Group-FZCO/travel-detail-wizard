import monkeyLogo from "@/assets/monkey-logo.png";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  textClassName?: string;
}

const sizes = {
  sm: "h-14",
  md: "h-16",
  lg: "h-44",
};

const Logo = ({ size = "sm", showText = false, textClassName = "text-foreground" }: LogoProps) => (
  <div className="flex items-center gap-2.5">
    <img src={monkeyLogo} alt="Digital Moonkey Travel" className={`${sizes[size]} object-contain`} />
    {showText && (
      <span className={`font-bold text-lg tracking-tight ${textClassName}`}>
        Digital Moonkey Travel
      </span>
    )}
  </div>
);

export default Logo;
