import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FiUsers } from "react-icons/fi";

const familyTypes = ["Joint Family","Nuclear Family","Single Parent","Living Independently"];
const familyValueOptions = ["Very Traditional / Conservative","Traditional with modern outlook","Moderate","Liberal / Progressive","Mixed"];
const livingSituations = ["With Parents","With Family","Own House","Rented Accommodation","Abroad","Hostel / Shared"];
const siblingOptions = ["No siblings","1 sibling","2 siblings","3 siblings","4 siblings","5+ siblings"];
const castes = ["Prefer not to say","Does not matter","Syed","Sheikh","Mughal","Pathan / Pashtun","Rajput","Jatt","Arain","Gujjar","Qureshi","Awan","Malik","Butt","Chaudhry","Khan","Ansari","Hashmi","Other"];
const occupations = ["Businessman","Government Employee","Private Sector","Doctor","Engineer","Teacher","Retired","Homemaker","Farmer / Agriculture","Self-employed","Not applicable","Other"];

const FamilyBackgroundStep = () => {
  const { control } = useFormContext();
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-token-2 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><FiUsers className="text-primary" /></div>
        <div>
          <h2 className="font-display text-token-lg font-semibold text-foreground">Family Background</h2>
          <p className="text-token-sm text-muted-foreground">Tell us about your family</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="familyType" render={({ field }) => (<FormItem><FormLabel>Family Type *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select family type" /></SelectTrigger></FormControl><SelectContent>{familyTypes.map((f) => (<SelectItem key={f} value={f}>{f}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
        <FormField control={control} name="livingWith" render={({ field }) => (<FormItem><FormLabel>Currently Living *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select living situation" /></SelectTrigger></FormControl><SelectContent>{livingSituations.map((l) => (<SelectItem key={l} value={l}>{l}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="caste" render={({ field }) => (<FormItem><FormLabel>Caste / Tribe</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select caste" /></SelectTrigger></FormControl><SelectContent>{castes.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
        <FormField control={control} name="familyValues" render={({ field }) => (<FormItem><FormLabel>Family Values</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select family values" /></SelectTrigger></FormControl><SelectContent>{familyValueOptions.map((f) => (<SelectItem key={f} value={f}>{f}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
      </div>
      <FormField control={control} name="siblings" render={({ field }) => (<FormItem><FormLabel>Number of Siblings</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select number of siblings" /></SelectTrigger></FormControl><SelectContent>{siblingOptions.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="fatherOccupation" render={({ field }) => (<FormItem><FormLabel>Father's Occupation</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select occupation" /></SelectTrigger></FormControl><SelectContent>{occupations.map((o) => (<SelectItem key={o} value={o}>{o}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
        <FormField control={control} name="motherOccupation" render={({ field }) => (<FormItem><FormLabel>Mother's Occupation</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select occupation" /></SelectTrigger></FormControl><SelectContent>{occupations.map((o) => (<SelectItem key={o} value={o}>{o}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
      </div>
      <div className="bg-muted/50 rounded-lg p-token-4 mt-4">
        <p className="text-token-sm text-muted-foreground"><span className="font-medium text-foreground">Privacy:</span> Your family details help others understand your background. You can choose to hide specific information in your privacy settings.</p>
      </div>
    </div>
  );
};

export default FamilyBackgroundStep;
