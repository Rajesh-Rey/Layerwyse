import { useForm } from "@tanstack/react-form";
import {
  calculatorFormSchema,
  CalculatorFormValues,
  DifficultyLevel,
  ExtraMaterial,
} from "./types";
import { XIcon } from "lucide-react";

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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DatePicker } from "@/components/ui/date-picker";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-select";
import { CANCELLED } from "node:dns/promises";
import { AccordionHeader } from "@radix-ui/react-accordion";
import { useEffect } from "react";

const currency = "KWD";

const serviceOptions = [
  { value: "printing", label: "3D Printing" },
  { value: "modeling", label: "3D Modeling" },
  { value: "painting", label: "Painting" },
  { value: "sanding", label: "Sanding" },
];

const categoryOptions = [
  { value: "miniatures", label: "Miniatures" },
  { value: "figures", label: "Figures" },
  { value: "prototypes", label: "Prototypes" },
  { value: "functional", label: "Functional Parts" },
  { value: "art", label: "Art & Decorative" },
  { value: "cosplay", label: "Cosplay Props" },
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
      materialCost: 0.01,
      volume: 0,
      printer: "",
      printTime: 0,
      removalTime: 0,
      sandingDifficulty: "none",
      paintingDifficulty: "none",
      supportDifficulty: "none",
      modelingDifficulty: "none",
      images: [] as string[],
      files: [] as string[],
      extraMaterials: [] as ExtraMaterial[],

      country: "",
      electricityCost: 0,
      printerWattage: 0,
      machinePrice: 0,
      machineDepreciationRate: 0,
      machinePurchaseDate: "",
      consumableCost: 0,
      failureRate: 0,
      hourlyLaborRate: 0,
    },
    listeners: {
      onChangeDebounceMs: 80, // 500ms debounce
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
    <div className={cn(className)}>
      <form
        id="calculator-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Accordion
          type="multiple"
          defaultValue={[
            "basic-info",
            "pricing",
            "printing",
            "difficulty",
            "files",
            "extra-materials",
          ]}
          className="w-full"
        >
          {/* Basic Information Section */}
          <AccordionItem value="basic-info">
            <AccordionTrigger className="text-lg font-semibold">
              Basic Information
            </AccordionTrigger>
            <AccordionContent>
              <FieldGroup className="pt-2">
                <form.Field
                  name="name"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Project Name
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

                <form.Field
                  name="date"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Date</FieldLabel>
                        <DatePicker
                          id={field.name}
                          editable={false}
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
                          placeholder="Select project date"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
              </FieldGroup>
            </AccordionContent>
          </AccordionItem>

          {/* Printing Section */}
          {form.getFieldValue("services").includes("printing") && (
            <AccordionItem value="printing">
              <AccordionTrigger className="text-lg font-semibold">
                Printing Details
              </AccordionTrigger>
              <AccordionContent>
                <FieldGroup className="pt-2">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <form.Field
                      name="material"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>
                              Material
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
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                    />

                    <form.Field
                      name="printer"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>
                              Printer
                            </FieldLabel>
                            <Select
                              value={field.state.value}
                              onValueChange={(value) =>
                                field.handleChange(value)
                              }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select printer" />
                              </SelectTrigger>
                              <SelectContent>
                                {printerOptions.map((option) => (
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
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <form.Field
                      name="materialCost"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>
                              Material Cost ({currency}/L)
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
                      name="volume"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>
                              Volume (mL)
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
                      name="printTime"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
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

                  <form.Field
                    name="removalTime"
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
                </FieldGroup>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Difficulty Levels Section */}
          {form.getFieldValue("services").length > 0 && (
            <AccordionItem value="difficulty">
              <AccordionTrigger className="text-lg font-semibold">
                Difficulty Levels
                <AccordionHeader className="text-destructive text-sm">
                  You must select a category first
                </AccordionHeader>
              </AccordionTrigger>
              <AccordionContent>
                <FieldGroup className="pt-2">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {form.getFieldValue("services").includes("painting") && (
                      <form.Field
                        name="sandingDifficulty"
                        children={(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldLabel htmlFor={field.name}>
                                Sanding Difficulty
                              </FieldLabel>
                              <Select
                                disabled={!form.getFieldValue("category")}
                                value={field.state.value}
                                onValueChange={(value) =>
                                  field.handleChange(value)
                                }
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
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldLabel htmlFor={field.name}>
                                Painting Difficulty
                              </FieldLabel>
                              <Select
                                disabled={!form.getFieldValue("category")}
                                value={field.state.value}
                                onValueChange={(value) =>
                                  field.handleChange(value)
                                }
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
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldLabel htmlFor={field.name}>
                                Support Difficulty
                              </FieldLabel>
                              <Select
                                value={field.state.value}
                                onValueChange={(value) =>
                                  field.handleChange(value)
                                }
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
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldLabel htmlFor={field.name}>
                                Modeling Difficulty
                              </FieldLabel>
                              <Select
                                disabled={!form.getFieldValue("category")}
                                value={field.state.value}
                                onValueChange={(value) =>
                                  field.handleChange(value)
                                }
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
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Files Section */}
          <AccordionItem value="files">
            <AccordionTrigger className="text-lg font-semibold">
              Files & Images
            </AccordionTrigger>
            <AccordionContent>
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
            </AccordionContent>
          </AccordionItem>

          {/* Extra Materials Section */}
          <AccordionItem value="extra-materials">
            <AccordionTrigger className="text-lg font-semibold">
              Extra Materials
            </AccordionTrigger>
            <AccordionContent>
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
                            <span>Price ({currency})</span>
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
                                name={`extraMaterials[${index}].unitPrice`}
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
                                name={`extraMaterials[${index}].quantity`}
                                children={(subField) => (
                                  <Input
                                    id={subField.name}
                                    value={subField.state.value}
                                    onChange={(e) =>
                                      subField.handleChange(
                                        parseInt(e.target.value) || 1,
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
                              unitPrice: 0,
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
            </AccordionContent>
          </AccordionItem>
          {/* Pricing Section */}
          <AccordionItem value="pricing">
            <AccordionTrigger className="text-lg font-semibold">
              Pricing
            </AccordionTrigger>
            <AccordionContent>
              <FieldGroup className="pt-2">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <form.Field
                    name="quantity"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Quantity</FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) =>
                              field.handleChange(parseInt(e.target.value))
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
                    name="margin"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Margin (%)
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
                    name="price"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Price ({currency})
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
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

                <div className="flex gap-6">
                  <form.Field
                    name="packaging"
                    children={(field) => (
                      <Field orientation="horizontal">
                        <Checkbox
                          id={field.name}
                          checked={field.state.value}
                          onCheckedChange={(checked) =>
                            field.handleChange(checked === true)
                          }
                        />
                        <FieldLabel htmlFor={field.name}>
                          Include Packaging
                        </FieldLabel>
                      </Field>
                    )}
                  />

                  <form.Field
                    name="delivery"
                    children={(field) => (
                      <Field orientation="horizontal">
                        <Checkbox
                          id={field.name}
                          checked={field.state.value}
                          onCheckedChange={(checked) =>
                            field.handleChange(checked === true)
                          }
                        />
                        <FieldLabel htmlFor={field.name}>
                          Include Delivery
                        </FieldLabel>
                      </Field>
                    )}
                  />
                </div>
              </FieldGroup>
            </AccordionContent>
          </AccordionItem>

          {/* Advance Section */}
          <AccordionItem value="advanced">
            <AccordionTrigger className="text-lg font-semibold">
              Advance configurations
            </AccordionTrigger>
            <AccordionContent>
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
                  {/* TODO: Make into a slider */}
                  <form.Field
                    name="machineDepreciationRate"
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
                            Out of 100 prints of the items how many do you
                            expect to fail?
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
                            painting, support removal, and assembly. This is
                            used to calculate labor costs for each task.
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
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>

      <Field orientation="horizontal" className="justify-end gap-4 pt-6">
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>
        <Button type="submit" form="calculator-form">
          Calculate
        </Button>
      </Field>
    </div>
  );
}
