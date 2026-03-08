import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FiHeart } from "react-icons/fi";

const locations = ["Any location","Same city only","Same country only","Same country preferred","Open to relocation","Abroad only"];
const educationPreferences = ["Any education","At least High School","At least Bachelor's","At least Master's","PhD preferred","Islamic education preferred"];
const religiousExpectations = ["Very religious partner","Religious partner","Moderately religious","Flexible about religiosity","Must share same sect","Same values more important than practice"];
const castes = ["Any caste - Does not matter","Same caste preferred","Same caste required","Syed only","Sheikh only","Pathan only","Rajput only","Other specific requirement"];

const MarriagePreferencesStep = () => {
  const { control, watch, setValue } = useFormContext();
  const ageMin = watch("preferredAgeMin") || 18;
  const ageMax = watch("preferredAgeMax") || 40;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-token-2 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><FiHeart className="text-primary" /></div>
        <div>
          <h2 className="font-display text-token-lg font-semibold text-foreground">Marriage Preferences</h2>
          <p className="text-token-sm text-muted-foreground">What are you looking for in a partner?</p>
        </div>
      </div>
      <FormItem>
        <FormLabel>Preferred Age Range *</FormLabel>
        <div className="pt-2 pb-4">
          <div className="flex justify-between text-token-sm text-muted-foreground mb-2"><span>Min: {ageMin} years</span><span>Max: {ageMax} years</span></div>
          <div className="space-y-4">
            <div><label className="text-token-xs text-muted-foreground">Minimum Age</label><Slider value={[ageMin]} min={18} max={ageMax - 1} step={1} onValueChange={(value) => setValue("preferredAgeMin", value[0])} className="mt-2" /></div>
            <div><label className="text-token-xs text-muted-foreground">Maximum Age</label><Slider value={[ageMax]} min={ageMin + 1} max={70} step={1} onValueChange={(value) => setValue("preferredAgeMax", value[0])} className="mt-2" /></div>
          </div>
        </div>
      </FormItem>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="preferredLocation" render={({ field }) => (<FormItem><FormLabel>Location Preference</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select preference" /></SelectTrigger></FormControl><SelectContent>{locations.map((l) => (<SelectItem key={l} value={l}>{l}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
        <FormField control={control} name="preferredCaste" render={({ field }) => (<FormItem><FormLabel>Caste Preference</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select preference" /></SelectTrigger></FormControl><SelectContent>{castes.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="preferredEducation" render={({ field }) => (<FormItem><FormLabel>Education Preference</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select preference" /></SelectTrigger></FormControl><SelectContent>{educationPreferences.map((e) => (<SelectItem key={e} value={e}>{e}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
        <FormField control={control} name="religiousExpectations" render={({ field }) => (<FormItem><FormLabel>Religious Expectations *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select expectation" /></SelectTrigger></FormControl><SelectContent>{religiousExpectations.map((r) => (<SelectItem key={r} value={r}>{r}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
      </div>
      <div className="space-y-4 pt-4">
        <h3 className="font-medium text-foreground">Additional Preferences</h3>
        <FormField control={control} name="willingToRelocate" render={({ field }) => (<FormItem className="flex items-center justify-between rounded-lg border p-token-4"><div className="space-y-0.5"><FormLabel className="text-base">Willing to Relocate</FormLabel><FormDescription>I am open to relocating after marriage</FormDescription></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
        <FormField control={control} name="acceptDivorced" render={({ field }) => (<FormItem className="flex items-center justify-between rounded-lg border p-token-4"><div className="space-y-0.5"><FormLabel className="text-base">Open to Divorced Matches</FormLabel><FormDescription>I am open to matching with divorced individuals</FormDescription></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
        <FormField control={control} name="acceptWithChildren" render={({ field }) => (<FormItem className="flex items-center justify-between rounded-lg border p-token-4"><div className="space-y-0.5"><FormLabel className="text-base">Open to Matches with Children</FormLabel><FormDescription>I am open to matching with those who have children</FormDescription></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
      </div>
    </div>
  );
};

export default MarriagePreferencesStep;
