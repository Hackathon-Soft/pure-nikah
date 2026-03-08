import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FiUser } from "react-icons/fi";
import type { ProfileFormData } from "@/pages/dashboard/CreateProfile";

const countries = [
  "Pakistan",
  "India",
  "Bangladesh",
  "United Kingdom",
  "United States",
  "Canada",
  "Australia",
  "Saudi Arabia",
  "UAE",
  "Malaysia",
  "Germany",
  "France",
  "Other",
];

const heights = [
  "4'8\" (142 cm)",
  "4'9\" (145 cm)",
  "4'10\" (147 cm)",
  "4'11\" (150 cm)",
  "5'0\" (152 cm)",
  "5'1\" (155 cm)",
  "5'2\" (157 cm)",
  "5'3\" (160 cm)",
  "5'4\" (163 cm)",
  "5'5\" (165 cm)",
  "5'6\" (168 cm)",
  "5'7\" (170 cm)",
  "5'8\" (173 cm)",
  "5'9\" (175 cm)",
  "5'10\" (178 cm)",
  "5'11\" (180 cm)",
  "6'0\" (183 cm)",
  "6'1\" (185 cm)",
  "6'2\" (188 cm)",
  "6'3\" (191 cm)",
  "6'4\" (193 cm)",
  "6'5\" (196 cm)",
];

const BasicInfoStep = () => {
  const { control } = useFormContext<ProfileFormData>();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-token-2 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <FiUser className="text-primary" />
        </div>
        <div>
          <h2 className="font-display text-token-lg font-semibold text-foreground">
            Basic Information
          </h2>
          <p className="text-token-sm text-muted-foreground">
            Tell us about yourself
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name *</FormLabel>
              <FormControl>
                <Input placeholder="Enter your first name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name *</FormLabel>
              <FormControl>
                <Input placeholder="Enter your last name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth *</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Height *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select height" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {heights.map((h) => (
                    <SelectItem key={h} value={h}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="maritalStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marital Status *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="never_married">Never Married</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City *</FormLabel>
              <FormControl>
                <Input placeholder="Enter your city" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>About Me</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Write a brief introduction about yourself, your values, and what you're looking for..."
                className="min-h-[120px] resize-none"
                {...field}
              />
            </FormControl>
            <p className="text-token-xs text-muted-foreground mt-1">
              {field.value?.length || 0}/500 characters
            </p>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BasicInfoStep;
