C:\inetpub\wwwroot\ICSS-2025\src\types\Adjustments.ts
/_ ---------- Common fields (always required) ---------- _/
const baseSchema = z.object({
adjustment_hdr_id: z.number(),
activity_type: z.enum(["Direct", "Indirect", "SKF"]), // discriminant
category: z.string().min(1, "Category is required"),
type_of_adjustment: z.string().min(1, "Adjustment type is required"),
dtl_description: z.string().min(1, "Description is required"),
amount: z.string().min(1, "Amount is required"),
point_of_contact: z.string().min(1, "Point of contact is required"),
reverse_in_claim: z.string().optional(),
file_location: z.string().min(1, "File location is required"),
});

/_ ---------- Direct‑custom fields ---------- _/
const directSchema = baseSchema.extend({
sector: z.string().min(1, "Sector is required"),
wbs_rate_segment: z.string().min(1, "WBS rate segment is required"),
costing_sheet_wbs: z.string().min(1, "Costing sheet WBS is required"),
overhead_key_wbs: z.string().min(1, "Overhead key WBS is required"),
profit_center: z.string().min(1, "Profit center is required"),
wbs_element: z.string().min(1, "WBS element is required"),
project_definition: z.string().min(1, "Project definition is required"),
pch_l06: z.string().min(1, "PCH L06 is required"),
sch_h_grp: z.string().min(1, "SCH H GRP is required"),
sort_order: z.string().min(1, "Sort order is required"),
labor_oh: z.string().min(1, "Labor OH is required"),
other: z.string().min(1, "Other is required"),
icom: z.string().min(1, "ICOM is required"),
burden_type: z.string().min(1, "Burden type is required"),
segment: z.string().min(1, "Segment is required"),
});

/_ ---------- Indirect‑custom fields ---------- _/
const indirectSchema = baseSchema.extend({
activity_type: z.literal("Indirect"),
cost_center: z.string().min(1, "Cost center is required"),
cost_center_level_06: z.string().min(1, "Cost‑center level 06 is required"),
cost_center_rate_segment: z
.string()
.min(1, "Cost‑center rate segment is required"),
cost_center_relevant_costs: z
.string()
.min(1, "Relevant costs are required"),
rollup: z.string().min(1, "Rollup is required"),
pool_reference: z.string().min(1, "Pool reference is required"),
pool_name: z.string().min(1, "Pool name is required"),
schedule: z.string().min(1, "Schedule is required"),
sort: z.string().min(1, "Sort is required"),
receivers_segment: z.string().min(1, "Receivers segment is required"),
receivers_schedule: z.string().min(1, "Receivers schedule is required"),
receivers_pool_reference: z
.string()
.min(1, "Receivers pool reference is required"),
receivers_pool_name: z.string().min(1, "Receivers pool name is required"),
});

/_ ---------- SKF‑custom fields ---------- /
const skfSchema = baseSchema.extend({
activity_type: z.literal("SKF"),
skf: z.string().min(1, "SKF is required"),
long_name: z.string().min(1, "Long name is required"),
wbs_element_external_id: z
.string()
.min(1, "WBS element external id is required"),
/ SKF re‑uses many indirect fields – we add the same ones _/
cost_center: z.string().min(1, "Cost center is required"),
cost_center_level_06: z.string().min(1, "Cost‑center level 06 is required"),
cost_center_rate_segment: z
.string()
.min(1, "Cost‑center rate segment is required"),
cost_center_relevant_costs: z
.string()
.min(1, "Relevant costs are required"),
pool_reference: z.string().min(1, "Pool reference is required"),
pool_name: z.string().min(1, "Pool name is required"),
schedule: z.string().min(1, "Schedule is required"),
receivers_segment: z.string().min(1, "Receivers segment is required"),
receivers_schedule: z.string().min(1, "Receivers schedule is required"),
receivers_pool_reference: z
.string()
.min(1, "Receivers pool reference is required"),
receivers_pool_name: z.string().min(1, "Receivers pool name is required"),
});

/_ ---------- Discriminated union – the final schema ---------- _/
export const finalFormCustomSchema = z.discriminatedUnion("activity_type", [
directSchema,
indirectSchema,
skfSchema,
]);

CSS-2025\src\pages\admin\adjustments_components\FinalFormCustom.tsx

import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
Card,
CardHeader,
CardTitle,
CardDescription,
CardContent,
CardFooter,
} from "@/components/ui/card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { insertAdjDtlCustom } from "@/data/adjustments"; // your generic insert helper
import { FunctionStatus } from "@/types/Misc";

import {
DirectFormErrors,
IndirectFormErrors,
SKFFormErrors,
finalFormCustomSchema,
FinalFormCustomValues,
} from "@/types/Adjustments"; // ← the schema we just defined (same file)
import { useWizard } from "../\_context/AdjustmentWizardContext";

/_ ------------------------------------------------------------------ /
/ Props – only the two read‑only values are passed in /
/ ------------------------------------------------------------------ _/
type FinalFormCustomProps = {
readonly adjustment_hdr_id: number;
readonly activity_type: "Direct" | "Indirect" | "SKF";
};

export default function FinalFormCustom({
adjustment_hdr_id,
activity_type,
}: FinalFormCustomProps) {
const queryClient = useQueryClient();
const { reset } = useWizard();

const { mutateAsync, isPending, isError, error } = useMutation<
FunctionStatus,
unknown,
FinalFormCustomValues

> ({

    mutationFn: async (data) => await insertAdjDtlCustom(data),
    onSuccess: () => {
        toast.success("Adjustment detail saved");
        queryClient.invalidateQueries({ queryKey: ["dtlSelect"] });
        form.reset(); // clears the form after success
        reset(); // Resets the wizard
    },
    onError: (e) => {
        toast.error("Failed to save", {
            description:
                e instanceof Error
                    ? e.message
                    : "Unexpected error – check console",
            duration: Infinity,
        });
    },

});

/_ --------------------------------------------------------------
react‑hook‑form – the schema knows exactly which fields belong
to the chosen activity_type, so we can safely give it as the
resolver.
-------------------------------------------------------------- _/
const form = useForm<FinalFormCustomValues>({
resolver: zodResolver(finalFormCustomSchema),
defaultValues: {
adjustment_hdr_id,
activity_type,
// the rest will be filled in by the UI (empty strings)
category: "",
type_of_adjustment: "",
dtl_description: "",
amount: "",
point_of_contact: "",
reverse_in_claim: "",
file_location: "",
// Direct‑only (will stay empty when activity_type !== "Direct")
sector: "",
wbs_rate_segment: "",
costing_sheet_wbs: "",
overhead_key_wbs: "",
profit_center: "",
wbs_element: "",
project_definition: "",
pch_l06: "",
sch_h_grp: "",
sort_order: "",
labor_oh: "",
other: "",
icom: "",
burden_type: "",
// Indirect‑only
cost_center: "",
cost_center_level_06: "",
cost_center_rate_segment: "",
cost_center_relevant_costs: "",
rollup: "",
pool_reference: "",
pool_name: "",
schedule: "",
sort: "",
receivers_segment: "",
receivers_schedule: "",
receivers_pool_reference: "",
receivers_pool_name: "",
// SKF‑only
skf: "",
long_name: "",
wbs_element_external_id: "",
},
});

const onSubmit = async (values: FinalFormCustomValues) => {
await mutateAsync(values);
};

/_ ------------------------------------------------------------------
UI helpers – each group is rendered only when its activity_type
matches the value the user selected (which is read‑only).
------------------------------------------------------------------ _/
const renderDirectFields = () => {
// `watch` returns the current value of a field; we only render when it is "Direct"
const isDirect = form.watch("activity_type") === "Direct";

    if (!isDirect) return null;

    // safely cast the error object – we know we are in the Direct branch
    const errors = form.formState.errors as DirectFormErrors;
    return (
        <>
            <Field>
                <FieldLabel>Sector</FieldLabel>
                <Input {...form.register("sector")} />
                <FieldError>{errors.sector?.message}</FieldError>
            </Field>

            <Field>
                <FieldLabel>WBS Rate Segment</FieldLabel>
                <Input {...form.register("wbs_rate_segment")} />
                <FieldError>{errors.wbs_rate_segment?.message}</FieldError>
            </Field>

            <Field>
                <FieldLabel>Costing Sheet WBS</FieldLabel>
                <Input {...form.register("costing_sheet_wbs")} />
                <FieldError>{errors.costing_sheet_wbs?.message}</FieldError>
            </Field>

            <Field>
                <FieldLabel>Overhead Key WBS</FieldLabel>
                <Input {...form.register("overhead_key_wbs")} />
                <FieldError>{errors.overhead_key_wbs?.message}</FieldError>
            </Field>

            <Field>
                <FieldLabel>Profit Center</FieldLabel>
                <Input {...form.register("profit_center")} />
                <FieldError>{errors.profit_center?.message}</FieldError>
            </Field>

            <Field>
                <FieldLabel>WBS Element</FieldLabel>
                <Input {...form.register("wbs_element")} />
                <FieldError>{errors.wbs_element?.message}</FieldError>
            </Field>

            <Field>
                <FieldLabel>Project Definition</FieldLabel>
                <Input {...form.register("project_definition")} />
                <FieldError>
                    {errors.project_definition?.message}
                </FieldError>
            </Field>

            <Field>
                <FieldLabel>PCH L06</FieldLabel>
                <Input {...form.register("pch_l06")} />
                <FieldError>{errors.pch_l06?.message}</FieldError>
            </Field>

            <Field>
                <FieldLabel>SCH H GRP</FieldLabel>
                <Input {...form.register("sch_h_grp")} />
                <FieldError>{errors.sch_h_grp?.message}</FieldError>
            </Field>

            <Field>
                <FieldLabel>Sort Order</FieldLabel>
                <Input {...form.register("sort_order")} />
                <FieldError>{errors.sort_order?.message}</FieldError>
            </Field>

            <Field>
                <FieldLabel>Labor OH</FieldLabel>
                <Input {...form.register("labor_oh")} />
                <FieldError>{errors.labor_oh?.message}</FieldError>
            </Field>

            <Field>
                <FieldLabel>Other</FieldLabel>
                <Input {...form.register("other")} />
                <FieldError>{errors.other?.message}</FieldError>
            </Field>

            <Field>
                <FieldLabel>ICOM</FieldLabel>
                <Input {...form.register("icom")} />
                <FieldError>{errors.icom?.message}</FieldError>
            </Field>

            <Field>
                <FieldLabel>Burden Type</FieldLabel>
                <Input {...form.register("burden_type")} />
                <FieldError>{errors.burden_type?.message}</FieldError>
            </Field>
        </>
    );

};

const renderIndirectFields = () => {
const isInDirect = form.watch("activity_type") === "Indirect";

    if (!isInDirect) return null;

    // safely cast the error object – we know we are in the Direct branch
    const errors = form.formState.errors as IndirectFormErrors;

    return (
        <>
            <Field>
                <FieldLabel>Cost Center</FieldLabel>
                <Input {...form.register("cost_center")} />
                <FieldError>{errors.cost_center?.message}</FieldError>
            </Field>

            <Field>
                <FieldLabel>Cost Center Level 06</FieldLabel>
                <Input {...form.register("cost_center_level_06")} />
                <FieldError>
                    {errors.cost_center_level_06?.message}
                </FieldError>
            </Field>

            <Field>
                <FieldLabel>Cost Center Rate Segment</FieldLabel>
                <Input {...form.register("cost_center_rate_segment")} />
                <FieldError>
                    {errors.cost_center_rate_segment?.message}
                </FieldError>
            </Field>

            <Field>
                <FieldLabel>Relevant Costs</FieldLabel>
                <Input {...form.register("cost_center_relevant_costs")} />
                <FieldError>
                    {errors.cost_center_relevant_costs?.message}
                </FieldError>
            </Field>

            <Field>
                <FieldLabel>Rollup</FieldLabel>
                <Input {...form.register("rollup")} />
                <FieldError>{errors.rollup?.message}</FieldError>
            </Field>

            <Field>
                <FieldLabel>Pool Reference</FieldLabel>
                <Input {...form.register("pool_reference")} />
                <FieldError>{errors.pool_reference?.message}</FieldError>
            </Field>

            <Field>
                <FieldLabel>Pool Name</FieldLabel>
                <Input {...form.register("pool_name")} />
                <FieldError>{errors.pool_name?.message}</FieldError>
            </Field>

            <Field>
                <FieldLabel>Schedule</FieldLabel>
                <Input {...form.register("schedule")} />
                <FieldError>{errors.schedule?.message}</FieldError>
            </Field>

            <Field>
                <FieldLabel>Sort</FieldLabel>
                <Input {...form.register("sort")} />
                <FieldError>{errors.sort?.message}</FieldError>
            </Field>

            <Field>
                <FieldLabel>Receivers Segment</FieldLabel>
                <Input {...form.register("receivers_segment")} />
                <FieldError>{errors.receivers_segment?.message}</FieldError>
            </Field>

            <Field>
                <FieldLabel>Receivers Schedule</FieldLabel>
                <Input {...form.register("receivers_schedule")} />
                <FieldError>
                    {errors.receivers_schedule?.message}
                </FieldError>
            </Field>

            <Field>
                <FieldLabel>Receivers Pool Reference</FieldLabel>
                <Input {...form.register("receivers_pool_reference")} />
                <FieldError>
                    {errors.receivers_pool_reference?.message}
                </FieldError>
            </Field>

            <Field>
                <FieldLabel>Receivers Pool Name</FieldLabel>
                <Input {...form.register("receivers_pool_name")} />
                <FieldError>
                    {errors.receivers_pool_name?.message}
                </FieldError>
            </Field>
        </>
    );

};

const renderSkfFields = () => {
const isSKF = form.watch("activity_type") === "SKF";

    if (!isSKF) return null;

    // safely cast the error object – we know we are in the Direct branch
    const errors = form.formState.errors as SKFFormErrors;

    return (
        <>
            <Field>
                <FieldLabel>SKF</FieldLabel>
                <Input {...form.register("skf")} />
                <FieldError>{errors.skf?.message}</FieldError>
            </Field>

            <Field>
                <FieldLabel>Long Name</FieldLabel>
                <Input {...form.register("long_name")} />
                <FieldError>{errors.long_name?.message}</FieldError>
            </Field>

            <Field>
                <FieldLabel>WBS Element External ID</FieldLabel>
                <Input {...form.register("wbs_element_external_id")} />
                <FieldError>
                    {errors.wbs_element_external_id?.message}
                </FieldError>
            </Field>

            {/* SKF re‑uses many indirect fields – we just render them again */}
            {renderIndirectFields()}
        </>
    );

};

/_ ------------------------------------------------------------------
Main JSX – the form header + always‑editable fields + conditional part
------------------------------------------------------------------ _/
return (
<div className="flex justify-center">
<Card className="w-full sm:max-w-2xl">
<form
                id="adjustment-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >
<CardHeader>
<CardTitle>Custom Adjustment Detail</CardTitle>
<CardDescription>
{activity_type} adjustment – header ID is read‑only.
</CardDescription>
</CardHeader>

                <CardContent className="grid gap-4">
                    {/* ---- read‑only identifiers ---- */}
                    <Field>
                        <FieldLabel>Header ID</FieldLabel>
                        <Input
                            {...form.register("adjustment_hdr_id")}
                            readOnly
                            className="bg-muted"
                        />
                    </Field>

                    {/* ---- always‑editable fields ---- */}
                    <Field>
                        <FieldLabel>Category</FieldLabel>
                        <Input {...form.register("category")} />
                        <FieldError>
                            {form.formState.errors.category?.message}
                        </FieldError>
                    </Field>

                    <Field>
                        <FieldLabel>Adjustment Type</FieldLabel>
                        <Input {...form.register("type_of_adjustment")} />
                        <FieldError>
                            {
                                form.formState.errors.type_of_adjustment
                                    ?.message
                            }
                        </FieldError>
                    </Field>

                    <Field>
                        <FieldLabel>Description</FieldLabel>
                        <Input {...form.register("dtl_description")} />
                        <FieldError>
                            {form.formState.errors.dtl_description?.message}
                        </FieldError>
                    </Field>

                    <Field>
                        <FieldLabel>Amount</FieldLabel>
                        <Input {...form.register("amount")} />
                        <FieldError>
                            {form.formState.errors.amount?.message}
                        </FieldError>
                    </Field>

                    <Field>
                        <FieldLabel>Point of Contact</FieldLabel>
                        <Input {...form.register("point_of_contact")} />
                        <FieldError>
                            {
                                form.formState.errors.point_of_contact
                                    ?.message
                            }
                        </FieldError>
                    </Field>

                    <Field>
                        <FieldLabel>Reverse In Claim</FieldLabel>
                        <Input {...form.register("reverse_in_claim")} />
                        <FieldError>
                            {
                                form.formState.errors.reverse_in_claim
                                    ?.message
                            }
                        </FieldError>
                    </Field>

                    <Field>
                        <FieldLabel>File Location</FieldLabel>
                        <Input {...form.register("file_location")} />
                        <FieldError>
                            {form.formState.errors.file_location?.message}
                        </FieldError>
                    </Field>

                    {/* ---- conditional block based on activity_type ---- */}
                    {activity_type === "Direct" && renderDirectFields()}
                    {activity_type === "Indirect" && renderIndirectFields()}
                    {activity_type === "SKF" && renderSkfFields()}
                </CardContent>

                {/* ---- mutation error (optional) ---- */}
                {isError && (
                    <p className="text-destructive px-4 py-2">
                        {error instanceof Error
                            ? error.message
                            : typeof error === "string"
                              ? error
                              : JSON.stringify(error)}
                    </p>
                )}

                <CardFooter className="flex justify-end space-x-2">
                    <Button
                        type="reset"
                        variant="outline"
                        onClick={() => form.reset()}
                        disabled={isPending}
                    >
                        Reset
                    </Button>

                    {/* Save button – same style as other forms */}
                    <Button
                        type="submit"
                        form="adjustment-form"
                        disabled={isPending}
                        className="relative !flex"
                    >
                        {isPending && (
                            <LoaderCircle
                                size={20}
                                className="absolute animate-spin"
                            />
                        )}
                        <span
                            className={isPending ? "invisible" : "visible"}
                        >
                            Save
                        </span>
                    </Button>
                </CardFooter>
            </form>
        </Card>
    </div>

);
}

C:\inetpub\wwwroot\ICSS-Express\src\routes\adjustment.ts

function isDirect(body: AdjBody): body is DirectAdjBody {
return body.activity_type === "Direct";
}
function isIndirect(body: AdjBody): body is IndirectAdjBody {
return body.activity_type === "Indirect";
}
function isSkf(body: AdjBody): body is SkfAdjBody {
return body.activity_type === "SKF";
}

router.post(
"/dtl-insert-custom",
catchAsync(async (req, res) => {
const user_id = formatUserString(
(req.headers["x-iisnode-logon_user"] as string) ?? "",
);
const pool = await getPool();
const body = req.body as AdjBody;
const proc = req.body.activity_type === "Direct" ? "[dbo].[adjustment_dtl_direct_custom_insert]"
: req.body.activity_type === "Indirect" ? "[dbo].[adjustment_dtl_indirect_custom_insert]"
: "[dbo].[adjustment_dtl_skf_custom_insert]";

    // Start building the request – the common fields are always present
    const request = pool
    .request()
    .input("user_id", sql.VarChar, user_id)
    .input("adjustment_hdr_id", sql.Int, body.adjustment_hdr_id)
    .input("category", sql.VarChar, body.category)
    .input("type_of_adjustment", sql.VarChar, body.type_of_adjustment)
    .input("dtl_description", sql.VarChar, body.dtl_description)
    .input("amount", sql.VarChar, body.amount)
    .input("point_of_contact", sql.VarChar, body.point_of_contact)
    .input("reverse_in_claim", sql.VarChar, body.reverse_in_claim)
    .input("file_location", sql.VarChar, body.file_location);

    // -----------------------------------------------------------------
    // Add activity‑specific inputs – the type‑guard narrows `body`
    // -----------------------------------------------------------------
    if (isDirect(body)) {
    request
        .input("sector", sql.VarChar, body.sector)
        .input("fiscal_year", sql.VarChar, body.fiscal_year)
        .input("wbs_rate_segment", sql.VarChar, body.wbs_rate_segment)
        .input("company_code", sql.VarChar, body.company_code)
        .input("costing_sheet_wbs", sql.VarChar, body.costing_sheet_wbs)
        .input("overhead_key_wbs", sql.VarChar, body.overhead_key_wbs)
        .input("profit_center", sql.VarChar, body.profit_center)
        .input("wbs_element", sql.VarChar, body.wbs_element)
        .input("project_definition", sql.VarChar, body.project_definition)
        .input("pch_l06", sql.VarChar, body.pch_l06)
        .input("partner_wbs_element", sql.VarChar, body.partner_wbs_element)
        .input("partner_profit_center", sql.VarChar, body.partner_profit_center)
        .input("partner_cost_center", sql.VarChar, body.partner_cost_center)
        .input("gl_account", sql.VarChar, body.gl_account)
        .input("gl_account_text", sql.VarChar, body.gl_account_text)
        .input("sch_h_grp", sql.VarChar, body.sch_h_grp)
        .input("sort_order", sql.VarChar, body.sort_order)
        .input("labor_oh", sql.VarChar, body.labor_oh)
        .input("other", sql.VarChar, body.other)
        .input("icom", sql.VarChar, body.icom)
        .input("burden_type", sql.VarChar, body.burden_type)
        .input("segment", sql.VarChar, body.segment);
    }

    if (isIndirect(body)) {
    request
        .input("cost_center", sql.VarChar, body.cost_center)
        .input("cost_center_level_06", sql.VarChar, body.cost_center_level_06)
        .input("cost_center_rate_segment", sql.VarChar, body.cost_center_rate_segment)
        .input("cost_center_relevant_costs", sql.VarChar, body.cost_center_relevant_costs)
        .input("rollup", sql.VarChar, body.rollup)
        .input("pool_reference", sql.VarChar, body.pool_reference)
        .input("pool_name", sql.VarChar, body.pool_name)
        .input("schedule", sql.VarChar, body.schedule)
        .input("sort", sql.VarChar, body.sort)
        .input("receivers_segment", sql.VarChar, body.receivers_segment)
        .input("receivers_schedule", sql.VarChar, body.receivers_schedule)
        .input("receivers_pool_reference", sql.VarChar, body.receivers_pool_reference)
        .input("receivers_pool_name", sql.VarChar, body.receivers_pool_name);
    }

    if (isSkf(body)) {
    request
        .input("skf", sql.VarChar, body.skf)
        .input("long_name", sql.VarChar, body.long_name)
        .input("wbs_element_external_id", sql.VarChar, body.wbs_element_external_id);
    }

    // Execute the proc
    await request.execute(proc);

    res.send({success: true});

}),
);

C:\inetpub\wwwroot\ICSS-Express\src\types\Adjustments.ts

export type DirectAdjBody = {
activity_type: "Direct";
adjustment_hdr_id: number;
category: string;
type_of_adjustment: string;
dtl_description: string;
amount: string;
point_of_contact: string;
reverse_in_claim: string;
file_location: string;
sector: string;
fiscal_year: string;
wbs_rate_segment: string;
company_code: string;
costing_sheet_wbs: string;
overhead_key_wbs: string;
profit_center: string;
wbs_element: string;
project_definition: string;
pch_l06: string;
partner_wbs_element: string;
partner_profit_center: string;
partner_cost_center: string;
gl_account: string;
gl_account_text: string;
sch_h_grp: string;
sort_order: string;
labor_oh: string;
other: string;
icom: string;
burden_type: string;
segment: string;
};

export type IndirectAdjBody = {
activity_type: "Indirect";
adjustment_hdr_id: number;
category: string;
type_of_adjustment: string;
dtl_description: string;
amount: string;
point_of_contact: string;
reverse_in_claim: string;
file_location: string;
// Indirect‑only fields
cost_center: string;
cost_center_level_06: string;
cost_center_rate_segment: string;
cost_center_relevant_costs: string;
rollup: string;
pool_reference: string;
pool_name: string;
schedule: string;
sort: string;
receivers_segment: string;
receivers_schedule: string;
receivers_pool_reference: string;
receivers_pool_name: string;
// fields that are still sent but are null for Indirect
sector: null;
fiscal_year: null;
wbs_rate_segment: null;
company_code: null;
costing_sheet_wbs: null;
overhead_key_wbs: null;
profit_center: null;
wbs_element: null;
project_definition: null;
pch_l06: null;
partner_wbs_element: null;
partner_profit_center: null;
partner_cost_center: null;
gl_account: null;
gl_account_text: null;
sch_h_grp: null;
sort_order: null;
labor_oh: null;
other: null;
icom: null;
burden_type: null;
segment: null;
};

export type SkfAdjBody = {
activity_type: "SKF";
adjustment_hdr_id: number;
category: string;
type_of_adjustment: string;
dtl_description: string;
amount: string;
point_of_contact: string;
reverse_in_claim: string;
file_location: string;
// SKF‑only fields
skf: string;
long_name: string;
wbs_element_external_id: string;
// everything else is null for the SKF case
sector: null;
fiscal_year: null;
wbs_rate_segment: null;
company_code: null;
costing_sheet_wbs: null;
overhead_key_wbs: null;
profit_center: null;
wbs_element: null;
project_definition: null;
pch_l06: null;
partner_wbs_element: null;
partner_profit_center: null;
partner_cost_center: null;
gl_account: null;
gl_account_text: null;
sch_h_grp: null;
sort_order: null;
labor_oh: null;
other: null;
icom: null;
burden_type: null;
segment: null;
};

export type AdjBody = DirectAdjBody | IndirectAdjBody | SkfAdjBody;

SQL PROCS

EXECUTE [dbo].[adjustment_dtl_direct_custom_insert]
@user_id = 'M84423',
@adjustment_hdr_id = '5',
@category = 'Test',
@type_of_adjustment = 'Test',
@dtl_description = 'Test',
@amount = '99.99', -- amount is going into the direct (ps) record adjustments column
@point_of_contact = 'Test',
@reverse_in_claim = '',
@file_location = 'Somewhere',
@sector = 'Test',
@fiscal_year = '2025',
@wbs_rate_segment = 'Test',
@company_code = 'Test',
@costing_sheet_wbs = 'Test',
@overhead_key_wbs = 'Test',
@profit_center = 'Test',
@wbs_element = 'Test',
@project_definition = 'Test',
@pch_l06 = 'Test',
@partner_wbs_element = 'Test',
@partner_profit_center = 'Test',
@partner_cost_center = 'Test',
@gl_account = 'Test',
@gl_account_text = 'Test',
@sch_h_grp = 'Test',
@sort_order = 'Test',
@labor_oh = 'Test',
@other = 'Test',
@icom = 'Test',
@burden_type = 'Test',
@segment = 'Test'

EXECUTE [dbo].[adjustment_dtl_indirect_custom_insert]
@user_id = 'M84423',
@adjustment_hdr_id = '1',
@category = 'Test',
@type_of_adjustment = 'Test',
@dtl_description = 'Test',
@amount = '99.99', -- amount is going into the indirect (co) record adjustments column
@point_of_contact = 'Test',
@reverse_in_claim = 'Test',
@file_location = 'Test',
@fiscal_year = '2025',
@cost_center = 'Test',
@cost_center_level_06 = 'Test',
@company_code = 'Test',
@cost_center_rate_segment = 'Test',
@partner_cost_center = 'Test',
@partner_profit_center = 'Test',
@partner_wbs_element = 'Test',
@cost_center_relevant_costs = 'Test',
@gl_account = 'Test',
@gl_account_text = 'Test',
@rollup = 'Test',
@pool_reference = 'Test',
@pool_name = 'Test',
@segment = 'Test',
@schedule = 'Test',
@sort = 'Test',
@receivers_segment = 'Test',
@receivers_schedule = 'Test',
@receivers_pool_reference = 'Test',
@receivers_pool_name = 'Test'

EXECUTE [dbo].[adjustment_dtl_skf_custom_insert]
@user_id = 'M84423',
@adjustment_hdr_id = '1',
@category = 'Test',
@type_of_adjustment = 'Test',
@dtl_description = 'Test',
@amount = '99.99',
@point_of_contact = 'Test',
@reverse_in_claim = 'Test',
@file_location = 'Test',
@SKF = 'Test',
@long_name = 'Test',
@wbs_element_external_id = 'Test',
@cost_center = 'Test',
@segment = 'Test',
@schedule = 'Test',
@pool_name = 'Test',
@pool_reference = 'Test',
@receivers_segment = 'Test',
@receivers_schedule = 'Test',
@receivers_pool_name = 'Test',
@receivers_pool_reference = 'Test',
@gl_account = 'Test',
@gl_account_text = 'Test',
@cost_center_relevant_costs = 'Test'
