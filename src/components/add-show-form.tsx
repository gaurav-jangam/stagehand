
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { addShow } from "@/app/actions";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const showSchema = z.object({
  name: z.string().min(1, "Show name is required."),
  date: z.date({
    required_error: "A date is required.",
  }),
  venue: z.string().optional(),
});

type ShowFormValues = z.infer<typeof showSchema>;

interface AddShowFormProps {
  onShowAdded: () => void;
}

export function AddShowForm({ onShowAdded }: AddShowFormProps) {
  const { toast } = useToast();

  const form = useForm<ShowFormValues>({
    resolver: zodResolver(showSchema),
    defaultValues: {
      name: "",
      venue: "",
    },
  });

  async function onSubmit(data: ShowFormValues) {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("date", data.date.toISOString());
    if (data.venue) {
        formData.append("venue", data.venue);
    }
    
    const result = await addShow(formData);

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: typeof result.error === 'string' ? result.error : "There was a problem with your request.",
      });
    } else {
      toast({
        title: "Show Created!",
        description: `"${data.name}" has been successfully created.`,
      });
      onShowAdded();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Show Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter show name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0,0,0,0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="venue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venue (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter venue" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Creating Show..." : "Create Show"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
