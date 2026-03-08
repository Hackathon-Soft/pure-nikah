import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FiBriefcase } from "react-icons/fi";

const educationLevels = ["High School","Diploma / Certificate","Bachelor's Degree","Master's Degree","PhD / Doctorate","Islamic Studies / Alim","Hafiz-e-Quran","Professional Certification","Other"];
const professions = ["Doctor / Healthcare","Engineer","IT / Software","Teacher / Education","Business Owner","Finance / Banking","Legal / Law","Government / Civil Service","Islamic Scholar / Imam","Student","Homemaker","Self-employed","Other"];
const incomeRanges = ["Prefer not to say","Below 50,000 PKR / month","50,000 - 100,000 PKR","100,000 - 200,000 PKR","200,000 - 500,000 PKR","500,000 - 1,000,000 PKR","Above 1,000,000 PKR"];
const languages = ["Urdu","English","Arabic","Punjabi","Sindhi","Pashto","Balochi","Hindi","Bengali","Turkish","Persian / Farsi","French","German","Spanish","Other"];
const smokingOptions = ["Never smoked","Quit smoking","Occasionally","Regularly"];
const dietaryOptions = ["Strictly Halal only","Halal preferred","Vegetarian (Halal)","No specific restrictions"];

const LifestyleStep = () => {
  const { control, watch, setValue } = useFormContext();
  const selectedLanguages = watch("languages") || [];
  const handleLanguageChange = (language, checked) => {
    if (checked) { setValue("languages", [...selectedLanguages, language]); }
    else { setValue("languages", selectedLanguages.filter((l) => l !== language)); }
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-token-2 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><FiBriefcase className="text-primary" /></div>
        <div>
          <h2 className="font-display text-token-lg font-semibold text-foreground">Lifestyle & Career</h2>
          <p className="text-token-sm text-muted-foreground">Your education, work, and daily life</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="education" render={({ field }) => (<FormItem><FormLabel>Education Level *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select education" /></SelectTrigger></FormControl><SelectContent>{educationLevels.map((e) => (<SelectItem key={e} value={e}>{e}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
        <FormField control={control} name="profession" render={({ field }) => (<FormItem><FormLabel>Profession *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select profession" /></SelectTrigger></FormControl><SelectContent>{professions.map((p) => (<SelectItem key={p} value={p}>{p}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
      </div>
      <FormField control={control} name="incomeRange" render={({ field }) => (<FormItem><FormLabel>Monthly Income Range</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select income range" /></SelectTrigger></FormControl><SelectContent>{incomeRanges.map((i) => (<SelectItem key={i} value={i}>{i}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
      <FormField control={control} name="languages" render={() => (<FormItem><FormLabel>Languages Spoken *</FormLabel><div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">{languages.map((language) => (<div key={language} className="flex items-center space-x-2"><Checkbox id={`lang-${language}`} checked={selectedLanguages.includes(language)} onCheckedChange={(checked) => handleLanguageChange(language, checked)} /><label htmlFor={`lang-${language}`} className="text-token-sm text-foreground cursor-pointer">{language}</label></div>))}</div><FormMessage /></FormItem>)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="smoking" render={({ field }) => (<FormItem><FormLabel>Smoking</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select option" /></SelectTrigger></FormControl><SelectContent>{smokingOptions.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
        <FormField control={control} name="dietary" render={({ field }) => (<FormItem><FormLabel>Dietary Habits</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select option" /></SelectTrigger></FormControl><SelectContent>{dietaryOptions.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
      </div>
    </div>
  );
};

export default LifestyleStep;
