
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface OTPVerificationProps {
  memberEmail?: string;
  onComplete: (value: string) => void;
}

const OTPVerification = ({ memberEmail, onComplete }: OTPVerificationProps) => {
  return (
    <div className="mt-4 p-4 border rounded-lg">
      <h4 className="text-sm font-medium mb-2">Enter OTP sent to {memberEmail}</h4>
      <div className="flex gap-4 items-center">
        <InputOTP
          maxLength={6}
          render={({ slots }) => (
            <InputOTPGroup>
              {slots.map((slot, index) => (
                <InputOTPSlot key={index} {...slot} index={index} />
              ))}
            </InputOTPGroup>
          )}
          onComplete={onComplete}
        />
      </div>
    </div>
  );
};

export default OTPVerification;
