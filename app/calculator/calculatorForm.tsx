import { useForm } from "@tanstack/react-form";
import {
  calculatorFormSchema,
  CalculatorFormValues,
  DifficultyLevel,
  Material,
  ExtraMaterial,
  UploadedFileData,
} from "./types";
import { XIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { FileDropZone, type FileData } from "@/components/ui/file-drop-zone";
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { DatePicker } from "@/components/ui/date-picker";
import { cn, toNumOrZero } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { InfoTooltip } from "@/components/ui/info-tooltip";

const currency = "KWD";
const defaultResinCost = 11;
const allowMultipleMaterials = false;

const serviceOptions = [
  { value: "printing", label: "3D Printing" },
  { value: "modeling", label: "3D Modeling" },
  { value: "painting", label: "Painting" },
  { value: "sanding", label: "Sanding" },
  { value: "support", label: "Support" },
];

const categoryOptions = [
  { value: "miniatures", label: "Miniatures" },
  { value: "figures", label: "Figures" },
  { value: "prototypes", label: "Prototypes" },
  { value: "functional", label: "Functional Parts" },
  { value: "art", label: "Art & Decorative" },
  { value: "cosplay", label: "Cosplay Props" },
  { value: "magnets", label: "Magnets" },
  { value: "other", label: "Other" },
];

const materialOptions = [
  { value: "standardResin", label: "Standard Resin" },
  { value: "absLikeResin", label: "ABS-Like Resin" },
  { value: "flexibleResin", label: "Flexible Resin" },
  { value: "pla", label: "PLA" },
  { value: "abs", label: "ABS" },
  { value: "petg", label: "PETG" },
  { value: "tpu", label: "TPU" },
];

const printerOptions = [
  { value: "elegooMars3", label: "Elegoo Mars 3" },
  { value: "elegooSaturn", label: "Elegoo Saturn" },
  { value: "anycubicPhoton", label: "Anycubic Photon" },
  { value: "enderFDM", label: "Ender 3" },
  { value: "prusaMK4", label: "Prusa MK4" },
];

const difficultyOptions: { value: DifficultyLevel; label: string }[] = [
  { value: "none", label: "None" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
  { value: "expert", label: "Expert" },
];
const countryOptions = [{ value: "kuwait", label: "Kuwait" }];

type CalculatorFormProps = {
  className?: string;
  onChange?: (values: CalculatorFormValues) => void;
};

export function CalculatorForm({ className, onChange }: CalculatorFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      services: ["printing", "modeling", "painting", "sanding"] as string[],
      category: "",
      customer: "",
      date: new Date().toISOString().split("T")[0],
      quantity: 1,
      margin: 30,
      price: 0 as any,
      packaging: false,
      delivery: false,
      material: "standardResin",
      printer: "",
      printTime: 0,
      removalTimeInMinutes: 0,
      sandingDifficulty: "none",
      paintingDifficulty: "none",
      supportDifficulty: "none",
      modelingDifficulty: "none",
      images: [] as string[],
      files: [] as string[],
      uploadedFiles: [] as UploadedFileData[],
      extraMaterials: [] as ExtraMaterial[],
      materials: [
        { material: "standardResin", costPerKg: defaultResinCost, weight: 0 },
      ] as Material[],

      country: "kuwait",
      electricityCost: 0.014,
      printerWattage: 100,
      machinePrice: 500,
      machineDepreciationRate: 0,
      machinePurchaseDate: "",
      consumableCost: 0.25,
      failureRate: 3,
      hourlyLaborRate: 5,
    },
    listeners: {
      onChangeDebounceMs: 80,
      onChange: ({ formApi }) => {
        if (onChange) {
          const value = formApi.state.values;
          onChange(value);
        }
      },
    },
    validators: { onBlur: calculatorFormSchema },
    onSubmit: ({ value }) => {
      console.log("submitted", JSON.stringify(value, null, 2));
    },
  });

  return (
    <form
      id="calculator-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className={cn(className, "space-y-4")}
    >
      {/* Files & Images Card */}
      <Card className="bg-gray-900 p-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Files & Images</h2>
          <p className="text-muted-foreground text-sm">
            Upload your 3D model files and reference images. We&apos;ll
            automatically organize them for you.
          </p>
          <form.Field
            name="uploadedFiles"
            mode="array"
            children={(field) => (
              <FileDropZone
                value={field.state.value as FileData[]}
                onChange={(fileData) => {
                  field.setValue(fileData as UploadedFileData[]);
                }}
              />
            )}
          />
        </div>
      </Card>
      {/* Project Details Card */}
      <Card className="bg-gray-900 p-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Project Details</h2>
          <FieldGroup className="pt-2">
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="flex items-center gap-1.5"
                    >
                      Project Name
                      <InfoTooltip content="A unique name to identify this project for future reference" />
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Project Name"
                      autoComplete="on"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.Field
              name="services"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="flex items-center gap-1.5"
                    >
                      Services
                      <InfoTooltip content="Select all the services you'll provide for this project (printing, modeling, painting, etc.)" />
                    </FieldLabel>
                    <MultiSelect
                      options={serviceOptions}
                      selected={field.state.value}
                      onChange={(selected) => field.handleChange(selected)}
                      placeholder="Select services..."
                      searchPlaceholder="Search services..."
                    />
                    <FieldDescription>
                      Select all services required for this project
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.Field
              name="category"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="flex items-center gap-1.5"
                    >
                      Category
                      <InfoTooltip content="The type of product being created (e.g., miniatures, functional parts, cosplay props)" />
                    </FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) => field.handleChange(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.Field
              name="customer"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="flex items-center gap-1.5"
                    >
                      Customer
                      <InfoTooltip content="Name or identifier of the customer ordering this project" />
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Customer name"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </div>
      </Card>

      {/* Printing Details Card */}
      {form.getFieldValue("services").includes("printing") && (
        <Card className="bg-gray-900 p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Printing Details</h2>
            <FieldGroup className="pt-2">
              <form.Field
                name="printer"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel
                        htmlFor={field.name}
                        className="flex items-center gap-1.5"
                      >
                        Printer
                        <InfoTooltip content="The 3D printer that will be used for this project" />
                      </FieldLabel>
                      <Select
                        value={field.state.value}
                        onValueChange={(value) => field.handleChange(value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select printer" />
                        </SelectTrigger>
                        <SelectContent>
                          {printerOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <div className="flex items-end gap-2">
                <form.Field
                  name="removalTimeInMinutes"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="flex items-center gap-1.5"
                        >
                          Removal Time (minutes)
                          <InfoTooltip content="Estimated time to remove supports and clean the print after printing" />
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(toNumOrZero(e.target.value))
                          }
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
                <form.Field
                  name="printTime"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="flex items-center gap-1.5"
                        >
                          Print Time (hours)
                          <InfoTooltip content="Total print time as estimated by your slicer software" />
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(parseFloat(e.target.value))
                          }
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
              </div>

              <div className="materials">
                <FieldGroup className="pt-2">
                  <form.Field
                    name="materials"
                    mode="array"
                    children={(field) => (
                      <Field>
                        <div className="rounded-lg border">
                          <div className="space-y-2">
                            {field.state.value.map((_, index) => (
                              <div
                                className="itemContainer align-center container flex justify-between"
                                key={index}
                              >
                                <div className="grid w-full grid-cols-1 items-end gap-2 p-4 @xs:grid-cols-3">
                                  <form.Field
                                    name={`materials[${index}].material`}
                                    children={(field) => {
                                      const isInvalid =
                                        field.state.meta.isTouched &&
                                        !field.state.meta.isValid;
                                      return (
                                        <Field data-invalid={isInvalid}>
                                          <FieldLabel className="flex items-center gap-1.5">
                                            Material
                                            <InfoTooltip content="The type of filament or resin used for printing" />
                                          </FieldLabel>
                                          <Select
                                            value={field.state.value}
                                            onValueChange={(value) =>
                                              field.handleChange(value)
                                            }
                                          >
                                            <SelectTrigger className="w-full">
                                              <SelectValue placeholder="Select material" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {materialOptions.map((option) => (
                                                <SelectItem
                                                  key={option.value}
                                                  value={option.value}
                                                >
                                                  {option.label}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                          {isInvalid && (
                                            <FieldError
                                              errors={field.state.meta.errors}
                                            />
                                          )}
                                        </Field>
                                      );
                                    }}
                                  />
                                  <form.Field
                                    name={`materials[${index}].costPerKg`}
                                    children={(subField) => (
                                      <Field>
                                        <FieldLabel className="flex items-center gap-1.5">
                                          Cost/kg
                                          <InfoTooltip content="Your cost per kilogram for this material" />
                                        </FieldLabel>
                                        <Input
                                          id={subField.name}
                                          value={subField.state.value}
                                          onChange={(e) =>
                                            subField.handleChange(
                                              parseFloat(e.target.value) || 0,
                                            )
                                          }
                                          placeholder="0.00"
                                        />
                                      </Field>
                                    )}
                                  />
                                  <form.Field
                                    name={`materials[${index}].weight`}
                                    children={(subField) => (
                                      <Field>
                                        <FieldLabel className="flex items-center gap-1.5">
                                          Weight
                                          <InfoTooltip content="Weight of material used in grams (as estimated by your slicer)" />
                                        </FieldLabel>
                                        <Input
                                          id={subField.name}
                                          value={subField.state.value}
                                          onChange={(e) =>
                                            subField.handleChange(
                                              parseInt(e.target.value) || 0,
                                            )
                                          }
                                          placeholder=""
                                        />
                                      </Field>
                                    )}
                                  />
                                </div>

                                <Button
                                  className={cn(
                                    "text-muted-foreground hover:text-destructive h-8 w-8 place-items-center",
                                    "p-4",
                                    !allowMultipleMaterials && "hidden",
                                  )}
                                  type="button"
                                  disabled={!allowMultipleMaterials}
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => field.removeValue(index)}
                                >
                                  <XIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button
                          type="button"
                          disabled={!allowMultipleMaterials}
                          variant="outline"
                          size="sm"
                          className="mt-3"
                          onClick={() =>
                            field.pushValue({
                              material: "",
                              weight: 0,
                              costPerKg: 0,
                            })
                          }
                        >
                          Add Material
                        </Button>
                      </Field>
                    )}
                  />
                </FieldGroup>
              </div>
            </FieldGroup>
          </div>
        </Card>
      )}

      {/* Difficulty Levels Card */}
      {form.getFieldValue("services").length > 0 && (
        <Card className="bg-gray-900 p-6">
          <div className="space-y-4">
            <div className="text-lg font-semibold">
              Difficulty Levels
              {!form.getFieldValue("category") && (
                <div className="text-sm text-red-500">
                  You must select a category first
                </div>
              )}
            </div>
            <FieldGroup className="pt-2">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {form.getFieldValue("services").includes("painting") && (
                  <form.Field
                    name="sandingDifficulty"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel
                            htmlFor={field.name}
                            className="flex items-center gap-1.5"
                          >
                            Sanding Difficulty
                            <InfoTooltip content="How complex is the sanding work required for this project" />
                          </FieldLabel>
                          <Select
                            disabled={!form.getFieldValue("category")}
                            value={field.state.value}
                            onValueChange={(value) => field.handleChange(value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              {difficultyOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                )}

                {form.getFieldValue("services").includes("painting") && (
                  <form.Field
                    name="paintingDifficulty"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel
                            htmlFor={field.name}
                            className="flex items-center gap-1.5"
                          >
                            Painting Difficulty
                            <InfoTooltip content="How complex is the painting work required (detail level, color count, techniques)" />
                          </FieldLabel>
                          <Select
                            disabled={!form.getFieldValue("category")}
                            value={field.state.value}
                            onValueChange={(value) => field.handleChange(value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              {difficultyOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                )}
                {form.getFieldValue("services").includes("support") && (
                  <form.Field
                    name="supportDifficulty"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel
                            htmlFor={field.name}
                            className="flex items-center gap-1.5"
                          >
                            Support Difficulty
                            <InfoTooltip content="How complex is the support removal work (delicate areas, intricate details)" />
                          </FieldLabel>
                          <Select
                            value={field.state.value}
                            disabled={!form.getFieldValue("category")}
                            onValueChange={(value) => field.handleChange(value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              {difficultyOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                )}

                {form.getFieldValue("services").includes("modeling") && (
                  <form.Field
                    name="modelingDifficulty"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel
                            htmlFor={field.name}
                            className="flex items-center gap-1.5"
                          >
                            Modeling Difficulty
                            <InfoTooltip content="How complex is the 3D modeling work (custom sculpting, modifications, print prep)" />
                          </FieldLabel>
                          <Select
                            disabled={!form.getFieldValue("category")}
                            value={field.state.value}
                            onValueChange={(value) => field.handleChange(value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              {difficultyOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                )}
              </div>
            </FieldGroup>
          </div>
        </Card>
      )}

      {/* Extra Materials Card */}
      <Card className="bg-gray-900 p-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Extra Materials</h2>
          <FieldGroup className="pt-2">
            <form.Field
              name="extraMaterials"
              mode="array"
              children={(field) => (
                <Field>
                  <FieldDescription>
                    Add extra materials used in this project (e.g., magnets,
                    keychain rings, metal inserts)
                  </FieldDescription>
                  <div className="rounded-lg border">
                    <div className="space-y-2">
                      {field.state.value.map((_, index) => (
                        <div
                          className="itemContainer align-center @container flex justify-between"
                          key={index}
                        >
                          <div className="grid w-full grid-cols-1 items-end gap-2 p-4 @xs:grid-cols-3">
                            <form.Field
                              name={`extraMaterials[${index}].name`}
                              children={(subField) => (
                                <Field>
                                  <FieldLabel className="flex items-center gap-1.5">
                                    Name
                                    <InfoTooltip content="Name of the extra material (e.g., magnets, inserts, keychain rings)" />
                                  </FieldLabel>
                                  <Input
                                    id={subField.name}
                                    value={subField.state.value}
                                    onChange={(e) =>
                                      subField.handleChange(e.target.value)
                                    }
                                    placeholder="e.g., Magnets"
                                  />
                                </Field>
                              )}
                            />
                            <form.Field
                              name={`extraMaterials[${index}].unitCost`}
                              children={(subField) => (
                                <Field>
                                  <FieldLabel className="flex items-center gap-1.5">
                                    Cost ({currency})
                                    <InfoTooltip content="Cost per unit of this extra material" />
                                  </FieldLabel>
                                  <Input
                                    id={subField.name}
                                    value={subField.state.value}
                                    onChange={(e) =>
                                      subField.handleChange(
                                        parseFloat(e.target.value) || 0,
                                      )
                                    }
                                    placeholder="0.00"
                                  />
                                </Field>
                              )}
                            />
                            <form.Field
                              name={`extraMaterials[${index}].quantity`}
                              children={(subField) => (
                                <Field>
                                  <FieldLabel className="flex items-center gap-1.5">
                                    Quantity
                                    <InfoTooltip content="Number of units used in this project" />
                                  </FieldLabel>
                                  <Input
                                    id={subField.name}
                                    value={subField.state.value}
                                    onChange={(e) =>
                                      subField.handleChange(
                                        parseInt(e.target.value) || 0,
                                      )
                                    }
                                    placeholder="1"
                                  />
                                </Field>
                              )}
                            />
                          </div>

                          <Button
                            className="text-muted-foreground hover:text-destructive h-8 w-8 place-items-center p-4"
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => field.removeValue(index)}
                          >
                            <XIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() =>
                      field.pushValue({
                        name: "",
                        unitCost: 0,
                        quantity: 1,
                      })
                    }
                  >
                    Add Material
                  </Button>
                </Field>
              )}
            />
          </FieldGroup>
        </div>
      </Card>

      {/* Advanced Configurations Card */}
      <Card className="bg-gray-900 p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Advance configurations</h2>
            <div className="flex items-center gap-2">
              <Label
                htmlFor="advanced-toggle"
                className="text-muted-foreground text-sm"
              >
                {showAdvanced ? "Hide" : "Show"}
              </Label>
              <Switch
                id="advanced-toggle"
                checked={showAdvanced}
                onCheckedChange={setShowAdvanced}
              />
            </div>
          </div>

          {showAdvanced && (
            <FieldGroup className="pt-2">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <form.Field
                  name="country"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="flex items-center gap-1.5"
                        >
                          Country
                          <InfoTooltip content="Your location for regional cost calculations and currency" />
                        </FieldLabel>
                        <Select
                          value={field.state.value}
                          onValueChange={(value) => field.handleChange(value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countryOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                <form.Field
                  name="electricityCost"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="flex items-center gap-1.5"
                        >
                          Electricity Cost ({currency} / kWh)
                          <InfoTooltip content="Your local electricity rate per kilowatt-hour for accurate energy cost calculations" />
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(parseFloat(e.target.value))
                          }
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                <form.Field
                  name="printerWattage"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="flex items-center gap-1.5"
                        >
                          Printer Wattage (W)
                          <InfoTooltip content="Power consumption of your 3D printer in watts (check your printer specs)" />
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(parseFloat(e.target.value))
                          }
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                <form.Field
                  name="machinePrice"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="flex items-center gap-1.5"
                        >
                          Machine Price ({currency})
                          <InfoTooltip content="Original purchase price of your 3D printer for depreciation calculations" />
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(parseFloat(e.target.value))
                          }
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                <form.Field
                  name="machineDepreciationRate"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="flex items-center gap-1.5"
                        >
                          Machine Depreciation Rate (%)
                          <InfoTooltip content="Annual depreciation percentage for your printer (typically 10-20% per year)" />
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(parseFloat(e.target.value))
                          }
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                <form.Field
                  name="machinePurchaseDate"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="flex items-center gap-1.5"
                        >
                          Machine Purchase Date
                          <InfoTooltip content="When you purchased your printer, used to calculate accumulated depreciation" />
                        </FieldLabel>
                        <DatePicker
                          id={field.name}
                          value={
                            field.state.value
                              ? new Date(field.state.value)
                              : undefined
                          }
                          onChange={(date) => {
                            field.handleChange(
                              date ? date.toISOString().split("T")[0] : "",
                            );
                          }}
                          placeholder="Select purchase date"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                <form.Field
                  name="consumableCost"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="flex items-center gap-1.5"
                        >
                          Consumable Cost ({currency} / print)
                          <InfoTooltip content="Cost of consumables like FEP film, nozzles, build plates, and cleaning supplies per print" />
                        </FieldLabel>
                        <FieldDescription>
                          Total cost of consumables used during the printing
                          process.
                        </FieldDescription>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(parseFloat(e.target.value))
                          }
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                <form.Field
                  name="failureRate"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="flex items-center gap-1.5"
                        >
                          Fail Rate (%)
                          <InfoTooltip content="Expected percentage of failed prints to factor into pricing (covers material waste and reprints)" />
                        </FieldLabel>
                        <FieldDescription>
                          Out of 100 prints of the items how many do you expect
                          to fail?
                        </FieldDescription>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(parseFloat(e.target.value))
                          }
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                <form.Field
                  name="hourlyLaborRate"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="flex items-center gap-1.5"
                        >
                          Hourly Labor Rate ({currency} / hour)
                          <InfoTooltip content="Your hourly rate for manual work like sanding, painting, support removal, and assembly" />
                        </FieldLabel>
                        <FieldDescription>
                          Your hourly rate for manual work like sanding,
                          painting, support removal, and assembly. This is used
                          to calculate labor costs for each task.
                        </FieldDescription>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(parseFloat(e.target.value))
                          }
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
              </div>
            </FieldGroup>
          )}
        </div>
      </Card>
    </form>
  );
}
