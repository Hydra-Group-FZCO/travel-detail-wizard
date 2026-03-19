import monkeyLogo from "@/assets/monkey-logo.jpg";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  textClassName?: string;
}

const sizes = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

const Logo = ({ size = "sm", showText = true, textClassName = "text-foreground" }: LogoProps) => (
  <div className="flex items-center gap-2.5">
    <img src={monkeyLogo} alt="Digital Moonkey Travel" className={`${sizes[size]} rounded-lg object-cover`} />
    {showText && (
      <span className={`font-bold text-lg tracking-tight ${textClassName}`}>
        Digital Moonkey Travel
      </span>
    )}
  </div>
);

export default Logo;
