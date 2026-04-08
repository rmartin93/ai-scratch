// C:\inetpub\wwwroot\ICSS-2025\src\pages\admin\adjustments_components\FinalFormCustom.tsx
// Corrected form - all fields match SQL proc params

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

import { insertAdjDtlCustom } from "@/data/adjustments";
import { FunctionStatus } from "@/types/Misc";

import {
    DirectFormErrors,
    IndirectFormErrors,
    SKFFormErrors,
    finalFormCustomSchema,
    FinalFormCustomValues,
} from "@/types/Adjustments";
import { useWizard } from "../_context/AdjustmentWizardContext";

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
    >({
        mutationFn: async (data) => await insertAdjDtlCustom(data),
        onSuccess: () => {
            toast.success("Adjustment detail saved");
            queryClient.invalidateQueries({ queryKey: ["dtlSelect"] });
            form.reset();
            reset();
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

    const form = useForm<FinalFormCustomValues>({
        resolver: zodResolver(finalFormCustomSchema),
        defaultValues: {
            adjustment_hdr_id,
            activity_type,
            // Base fields
            category: "",
            type_of_adjustment: "",
            dtl_description: "",
            amount: "",
            point_of_contact: "",
            reverse_in_claim: "",
            file_location: "",
            // Direct-only
            ...(activity_type === "Direct" && {
                sector: "",
                fiscal_year: "",
                wbs_rate_segment: "",
                company_code: "",
                costing_sheet_wbs: "",
                overhead_key_wbs: "",
                profit_center: "",
                wbs_element: "",
                project_definition: "",
                pch_l06: "",
                partner_wbs_element: "",
                partner_profit_center: "",
                partner_cost_center: "",
                gl_account: "",
                gl_account_text: "",
                sch_h_grp: "",
                sort_order: "",
                labor_oh: "",
                other: "",
                icom: "",
                burden_type: "",
                segment: "",
            }),
            // Indirect-only
            ...(activity_type === "Indirect" && {
                fiscal_year: "",
                cost_center: "",
                cost_center_level_06: "",
                company_code: "",
                cost_center_rate_segment: "",
                partner_cost_center: "",
                partner_profit_center: "",
                partner_wbs_element: "",
                cost_center_relevant_costs: "",
                gl_account: "",
                gl_account_text: "",
                rollup: "",
                pool_reference: "",
                pool_name: "",
                segment: "",
                schedule: "",
                sort: "",
                receivers_segment: "",
                receivers_schedule: "",
                receivers_pool_reference: "",
                receivers_pool_name: "",
            }),
            // SKF-only
            ...(activity_type === "SKF" && {
                skf: "",
                long_name: "",
                wbs_element_external_id: "",
                cost_center: "",
                segment: "",
                schedule: "",
                pool_name: "",
                pool_reference: "",
                receivers_segment: "",
                receivers_schedule: "",
                receivers_pool_name: "",
                receivers_pool_reference: "",
                gl_account: "",
                gl_account_text: "",
                cost_center_relevant_costs: "",
            }),
        },
    });

    const onSubmit = async (values: FinalFormCustomValues) => {
        await mutateAsync(values);
    };

    /* ---- Direct fields ---- */
    const renderDirectFields = () => {
        if (activity_type !== "Direct") return null;
        const errors = form.formState.errors as DirectFormErrors;
        return (
            <>
                <Field>
                    <FieldLabel>Sector</FieldLabel>
                    <Input {...form.register("sector")} />
                    <FieldError>{errors.sector?.message}</FieldError>
                </Field>

                <Field>
                    <FieldLabel>Fiscal Year</FieldLabel>
                    <Input {...form.register("fiscal_year")} />
                    <FieldError>{errors.fiscal_year?.message}</FieldError>
                </Field>

                <Field>
                    <FieldLabel>WBS Rate Segment</FieldLabel>
                    <Input {...form.register("wbs_rate_segment")} />
                    <FieldError>
                        {errors.wbs_rate_segment?.message}
                    </FieldError>
                </Field>

                <Field>
                    <FieldLabel>Company Code</FieldLabel>
                    <Input {...form.register("company_code")} />
                    <FieldError>{errors.company_code?.message}</FieldError>
                </Field>

                <Field>
                    <FieldLabel>Costing Sheet WBS</FieldLabel>
                    <Input {...form.register("costing_sheet_wbs")} />
                    <FieldError>
                        {errors.costing_sheet_wbs?.message}
                    </FieldError>
                </Field>

                <Field>
                    <FieldLabel>Overhead Key WBS</FieldLabel>
                    <Input {...form.register("overhead_key_wbs")} />
                    <FieldError>
                        {errors.overhead_key_wbs?.message}
                    </FieldError>
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
                    <FieldLabel>Partner WBS Element</FieldLabel>
                    <Input {...form.register("partner_wbs_element")} />
                    <FieldError>
                        {errors.partner_wbs_element?.message}
                    </FieldError>
                </Field>

                <Field>
                    <FieldLabel>Partner Profit Center</FieldLabel>
                    <Input {...form.register("partner_profit_center")} />
                    <FieldError>
                        {errors.partner_profit_center?.message}
                    </FieldError>
                </Field>

                <Field>
                    <FieldLabel>Partner Cost Center</FieldLabel>
                    <Input {...form.register("partner_cost_center")} />
                    <FieldError>
                        {errors.partner_cost_center?.message}
                    </FieldError>
                </Field>

                <Field>
                    <FieldLabel>GL Account</FieldLabel>
                    <Input {...form.register("gl_account")} />
                    <FieldError>{errors.gl_account?.message}</FieldError>
                </Field>

                <Field>
                    <FieldLabel>GL Account Text</FieldLabel>
                    <Input {...form.register("gl_account_text")} />
                    <FieldError>
                        {errors.gl_account_text?.message}
                    </FieldError>
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

                <Field>
                    <FieldLabel>Segment</FieldLabel>
                    <Input {...form.register("segment")} />
                    <FieldError>{errors.segment?.message}</FieldError>
                </Field>
            </>
        );
    };

    /* ---- Indirect fields ---- */
    const renderIndirectFields = () => {
        if (activity_type !== "Indirect") return null;
        const errors = form.formState.errors as IndirectFormErrors;
        return (
            <>
                <Field>
                    <FieldLabel>Fiscal Year</FieldLabel>
                    <Input {...form.register("fiscal_year")} />
                    <FieldError>{errors.fiscal_year?.message}</FieldError>
                </Field>

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
                    <FieldLabel>Company Code</FieldLabel>
                    <Input {...form.register("company_code")} />
                    <FieldError>{errors.company_code?.message}</FieldError>
                </Field>

                <Field>
                    <FieldLabel>Cost Center Rate Segment</FieldLabel>
                    <Input {...form.register("cost_center_rate_segment")} />
                    <FieldError>
                        {errors.cost_center_rate_segment?.message}
                    </FieldError>
                </Field>

                <Field>
                    <FieldLabel>Partner Cost Center</FieldLabel>
                    <Input {...form.register("partner_cost_center")} />
                    <FieldError>
                        {errors.partner_cost_center?.message}
                    </FieldError>
                </Field>

                <Field>
                    <FieldLabel>Partner Profit Center</FieldLabel>
                    <Input {...form.register("partner_profit_center")} />
                    <FieldError>
                        {errors.partner_profit_center?.message}
                    </FieldError>
                </Field>

                <Field>
                    <FieldLabel>Partner WBS Element</FieldLabel>
                    <Input {...form.register("partner_wbs_element")} />
                    <FieldError>
                        {errors.partner_wbs_element?.message}
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
                    <FieldLabel>GL Account</FieldLabel>
                    <Input {...form.register("gl_account")} />
                    <FieldError>{errors.gl_account?.message}</FieldError>
                </Field>

                <Field>
                    <FieldLabel>GL Account Text</FieldLabel>
                    <Input {...form.register("gl_account_text")} />
                    <FieldError>
                        {errors.gl_account_text?.message}
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
                    <FieldError>
                        {errors.pool_reference?.message}
                    </FieldError>
                </Field>

                <Field>
                    <FieldLabel>Pool Name</FieldLabel>
                    <Input {...form.register("pool_name")} />
                    <FieldError>{errors.pool_name?.message}</FieldError>
                </Field>

                <Field>
                    <FieldLabel>Segment</FieldLabel>
                    <Input {...form.register("segment")} />
                    <FieldError>{errors.segment?.message}</FieldError>
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
                    <FieldError>
                        {errors.receivers_segment?.message}
                    </FieldError>
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

    /* ---- SKF fields ---- */
    const renderSkfFields = () => {
        if (activity_type !== "SKF") return null;
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

                <Field>
                    <FieldLabel>Cost Center</FieldLabel>
                    <Input {...form.register("cost_center")} />
                    <FieldError>{errors.cost_center?.message}</FieldError>
                </Field>

                <Field>
                    <FieldLabel>Segment</FieldLabel>
                    <Input {...form.register("segment")} />
                    <FieldError>{errors.segment?.message}</FieldError>
                </Field>

                <Field>
                    <FieldLabel>Schedule</FieldLabel>
                    <Input {...form.register("schedule")} />
                    <FieldError>{errors.schedule?.message}</FieldError>
                </Field>

                <Field>
                    <FieldLabel>Pool Name</FieldLabel>
                    <Input {...form.register("pool_name")} />
                    <FieldError>{errors.pool_name?.message}</FieldError>
                </Field>

                <Field>
                    <FieldLabel>Pool Reference</FieldLabel>
                    <Input {...form.register("pool_reference")} />
                    <FieldError>
                        {errors.pool_reference?.message}
                    </FieldError>
                </Field>

                <Field>
                    <FieldLabel>Receivers Segment</FieldLabel>
                    <Input {...form.register("receivers_segment")} />
                    <FieldError>
                        {errors.receivers_segment?.message}
                    </FieldError>
                </Field>

                <Field>
                    <FieldLabel>Receivers Schedule</FieldLabel>
                    <Input {...form.register("receivers_schedule")} />
                    <FieldError>
                        {errors.receivers_schedule?.message}
                    </FieldError>
                </Field>

                <Field>
                    <FieldLabel>Receivers Pool Name</FieldLabel>
                    <Input {...form.register("receivers_pool_name")} />
                    <FieldError>
                        {errors.receivers_pool_name?.message}
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
                    <FieldLabel>GL Account</FieldLabel>
                    <Input {...form.register("gl_account")} />
                    <FieldError>{errors.gl_account?.message}</FieldError>
                </Field>

                <Field>
                    <FieldLabel>GL Account Text</FieldLabel>
                    <Input {...form.register("gl_account_text")} />
                    <FieldError>
                        {errors.gl_account_text?.message}
                    </FieldError>
                </Field>

                <Field>
                    <FieldLabel>Relevant Costs</FieldLabel>
                    <Input {...form.register("cost_center_relevant_costs")} />
                    <FieldError>
                        {errors.cost_center_relevant_costs?.message}
                    </FieldError>
                </Field>
            </>
        );
    };

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
                            {activity_type} adjustment – header ID is read-only.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="grid gap-4">
                        {/* ---- read-only identifiers ---- */}
                        <Field>
                            <FieldLabel>Header ID</FieldLabel>
                            <Input
                                {...form.register("adjustment_hdr_id")}
                                readOnly
                                className="bg-muted"
                            />
                        </Field>

                        {/* ---- always-editable fields ---- */}
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
                        {activity_type === "Indirect" &&
                            renderIndirectFields()}
                        {activity_type === "SKF" && renderSkfFields()}
                    </CardContent>

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
                                className={
                                    isPending ? "invisible" : "visible"
                                }
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
