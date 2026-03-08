import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FiBook } from "react-icons/fi";

const sects = ["Sunni - Hanafi","Sunni - Shafi'i","Sunni - Maliki","Sunni - Hanbali","Shia - Twelver","Shia - Ismaili","Ahmadiyya","Non-denominational","Other"];
const prayerLevels = ["Always pray 5 times","Usually pray 5 times","Sometimes pray","Rarely pray","Trying to improve"];
const islamicValuesLevels = ["Very Important - Core of my life","Important - Guide my decisions","Moderately Important","Somewhat Important","Flexible approach"];
const religiousPracticeLevels = ["Very Religious","Religious","Moderately Religious","Somewhat Religious","Not very religious but respectful"];
const hijabBeardOptions = {
  female: ["Wear hijab always","Wear hijab in public","Wear hijab sometimes","Don't wear hijab but plan to","Don't wear hijab"],
  male: ["Keep full beard","Keep trimmed beard","Sometimes keep beard","Clean shaven"],
};
const quranLevels = ["Hafiz (memorized Quran)","Can recite fluently with Tajweed","Can recite well","Learning to recite","Basic recitation","Cannot recite yet"];

const ReligiousInfoStep = () => {
  const { control, watch } = useFormContext();
  const gender = watch("gender");
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-token-2 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><FiBook className="text-primary" /></div>
        <div>
          <h2 className="font-display text-token-lg font-semibold text-foreground">Religious Information</h2>
          <p className="text-token-sm text-muted-foreground">Share your faith and practice</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="sect" render={({ field }) => (<FormItem><FormLabel>Sect / School of Thought *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select sect" /></SelectTrigger></FormControl><SelectContent>{sects.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
        <FormField control={control} name="prayerLevel" render={({ field }) => (<FormItem><FormLabel>Prayer Habits *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select prayer level" /></SelectTrigger></FormControl><SelectContent>{prayerLevels.map((p) => (<SelectItem key={p} value={p}>{p}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="islamicValues" render={({ field }) => (<FormItem><FormLabel>Islamic Values *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select importance level" /></SelectTrigger></FormControl><SelectContent>{islamicValuesLevels.map((v) => (<SelectItem key={v} value={v}>{v}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
        <FormField control={control} name="religiousPractice" render={({ field }) => (<FormItem><FormLabel>Religious Practice Level *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select practice level" /></SelectTrigger></FormControl><SelectContent>{religiousPracticeLevels.map((r) => (<SelectItem key={r} value={r}>{r}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gender && (
          <FormField control={control} name="hijabBeard" render={({ field }) => (<FormItem><FormLabel>{gender === "female" ? "Hijab" : "Beard"} Status</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select option" /></SelectTrigger></FormControl><SelectContent>{hijabBeardOptions[gender]?.map((opt) => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
        )}
        <FormField control={control} name="quranRecitation" render={({ field }) => (<FormItem><FormLabel>Quran Recitation</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger></FormControl><SelectContent>{quranLevels.map((q) => (<SelectItem key={q} value={q}>{q}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
      </div>
      <div className="bg-muted/50 rounded-lg p-token-4 mt-4">
        <p className="text-token-sm text-muted-foreground"><span className="font-medium text-foreground">Note:</span> Your religious information helps us find compatible matches who share your values and beliefs. This information will be visible on your profile.</p>
      </div>
    </div>
  );
};

export default ReligiousInfoStep;
