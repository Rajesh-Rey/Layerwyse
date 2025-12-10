import { useForm } from "@tanstack/react-form";
import {
  calculatorFormSchema,
  CalculatorFormValues,
  DifficultyLevel,
  Material,
  ExtraMaterial,
} from "./types";
import { XIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
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

const currency = "KWD";
const defaultResinCost = 11;

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
    <Card className={cn(className, "bg-gray-900 p-6")}>
      <form
        id="calculator-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-8"
      >
        {/* Project Details Section */}
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
                    <FieldLabel htmlFor={field.name}>Project Name</FieldLabel>
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
                    <FieldLabel htmlFor={field.name}>Services</FieldLabel>
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
                    <FieldLabel htmlFor={field.name}>Category</FieldLabel>
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
                    <FieldLabel htmlFor={field.name}>Customer</FieldLabel>
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

        {/* Printing Section */}
        {form.getFieldValue("services").includes("printing") && (
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
                      <FieldLabel htmlFor={field.name}>Printer</FieldLabel>
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
              <div className="flex gap-2">
                <form.Field
                  name="removalTimeInMinutes"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Removal Time (minutes)
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
                        <FieldLabel htmlFor={field.name}>
                          Print Time (hours)
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
                        <div className="rounded-lg border p-4">
                          {field.state.value.length > 0 && (
                            <div className="text-muted-foreground mb-2 grid grid-cols-[1fr_100px_80px_32px] gap-2 text-sm font-medium">
                              <span>Material</span>
                              <span>Price / kg ({currency})</span>
                              <span>Weight</span>
                              <span></span>
                            </div>
                          )}
                          <div className="space-y-2">
                            {field.state.value.map((_, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-[1fr_100px_80px_32px] items-center gap-2"
                              >
                                <form.Field
                                  name={`materials[${index}].material`}
                                  children={(field) => {
                                    const isInvalid =
                                      field.state.meta.isTouched &&
                                      !field.state.meta.isValid;
                                    return (
                                      <Field data-invalid={isInvalid}>
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
                                  )}
                                />
                                <form.Field
                                  name={`materials[${index}].weight`}
                                  children={(subField) => (
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
                                  )}
                                />
                                <Button
                                  type="button"
                                  disabled={true}
                                  variant="ghost"
                                  size="icon"
                                  className="text-muted-foreground hover:text-destructive h-8 w-8"
                                  onClick={() => field.removeValue(index)}
                                >
                                  <XIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          <Button
                            type="button"
                            disabled={true}
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
                        </div>
                      </Field>
                    )}
                  />
                </FieldGroup>
              </div>
            </FieldGroup>
          </div>
        )}

        {/* Difficulty Levels Section */}
        {form.getFieldValue("services").length > 0 && (
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
                          <FieldLabel htmlFor={field.name}>
                            Sanding Difficulty
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
                          <FieldLabel htmlFor={field.name}>
                            Painting Difficulty
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
                          <FieldLabel htmlFor={field.name}>
                            Support Difficulty
                          </FieldLabel>
                          <Select
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

                {form.getFieldValue("services").includes("modeling") && (
                  <form.Field
                    name="modelingDifficulty"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Modeling Difficulty
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
        )}

        {/* Extra Materials Section */}
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
                  <div className="rounded-lg border p-4">
                    {field.state.value.length > 0 && (
                      <div className="text-muted-foreground mb-2 grid grid-cols-[1fr_100px_80px_32px] gap-2 text-sm font-medium">
                        <span>Name</span>
                        <span>Cost ({currency})</span>
                        <span>Qty</span>
                        <span></span>
                      </div>
                    )}
                    <div className="space-y-2">
                      {field.state.value.map((_, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-[1fr_100px_80px_32px] items-center gap-2"
                        >
                          <form.Field
                            name={`extraMaterials[${index}].name`}
                            children={(subField) => (
                              <Input
                                id={subField.name}
                                value={subField.state.value}
                                onChange={(e) =>
                                  subField.handleChange(e.target.value)
                                }
                                placeholder="e.g., Magnets"
                              />
                            )}
                          />
                          <form.Field
                            name={`extraMaterials[${index}].unitCost`}
                            children={(subField) => (
                              <Input
                                id={subField.name}
                                value={subField.state.value}
                                onChange={(e) =>
                                  subField.handleChange(
                                    parseFloat(e.target.value),
                                  )
                                }
                                placeholder="0.00"
                              />
                            )}
                          />
                          <form.Field
                            name={`extraMaterials[${index}].quantity`}
                            children={(subField) => (
                              <Input
                                id={subField.name}
                                value={subField.state.value}
                                onChange={(e) =>
                                  subField.handleChange(
                                    parseInt(e.target.value),
                                  )
                                }
                                placeholder="1"
                              />
                            )}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive h-8 w-8"
                            onClick={() => field.removeValue(index)}
                          >
                            <XIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
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
                  </div>
                </Field>
              )}
            />
          </FieldGroup>
        </div>

        {/* Files Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Files & Images</h2>
          <FieldGroup className="pt-2">
            <form.Field
              name="images"
              mode="array"
              children={(field) => (
                <Field>
                  <FieldLabel>Image URLs</FieldLabel>
                  <FieldDescription>
                    Add URLs for reference images
                  </FieldDescription>
                  <div className="space-y-2">
                    {field.state.value.map((_, index) => (
                      <div key={index} className="flex gap-2">
                        <form.Field
                          name={`images[${index}]`}
                          children={(subField) => (
                            <Input
                              value={subField.state.value}
                              onChange={(e) =>
                                subField.handleChange(e.target.value)
                              }
                              placeholder="https://example.com/image.jpg"
                              className="flex-1"
                            />
                          )}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => field.removeValue(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => field.pushValue("")}
                    >
                      Add Image URL
                    </Button>
                  </div>
                </Field>
              )}
            />

            <form.Field
              name="files"
              mode="array"
              children={(field) => (
                <Field>
                  <FieldLabel>File URLs</FieldLabel>
                  <FieldDescription>
                    Add URLs for 3D model files (STL, OBJ, etc.)
                  </FieldDescription>
                  <div className="space-y-2">
                    {field.state.value.map((_, index) => (
                      <div key={index} className="flex gap-2">
                        <form.Field
                          name={`files[${index}]`}
                          children={(subField) => (
                            <Input
                              value={subField.state.value}
                              onChange={(e) =>
                                subField.handleChange(e.target.value)
                              }
                              placeholder="https://example.com/model.stl"
                              className="flex-1"
                            />
                          )}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => field.removeValue(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => field.pushValue("")}
                    >
                      Add File URL
                    </Button>
                  </div>
                </Field>
              )}
            />
          </FieldGroup>
        </div>

        {/* Advance Section */}
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
                        <FieldLabel htmlFor={field.name}>Country</FieldLabel>
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
                        <FieldLabel htmlFor={field.name}>
                          Electricity Cost ({currency} / kWh):
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
                        <FieldLabel htmlFor={field.name}>
                          Printer Wattage (W):
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
                        <FieldLabel htmlFor={field.name}>
                          Machine Price ({currency}):
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
                        <FieldLabel htmlFor={field.name}>
                          Machine Depreciation Rate (%):
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
                        <FieldLabel htmlFor={field.name}>
                          Machine Purchase Date
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
                        <FieldLabel htmlFor={field.name}>
                          Consumable Cost ({currency} / print):
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
                        <FieldLabel htmlFor={field.name}>
                          Fail Rate (%):
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
                        <FieldLabel htmlFor={field.name}>
                          Hourly Labor Rate ({currency} / hour):
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
      </form>
    </Card>
  );
}
