"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateInvoice, type CreateInvoiceData } from "@/hooks/use-invoices";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Validation schema
const invoiceItemSchema = z.object({
  item: z.string().min(1, "Item name is required"),
  qty: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be greater than or equal to 0"),
});

const invoiceSchema = z
  .object({
    customer: z.string().min(1, "Customer name is required"),
    date: z.string().min(1, "Invoice date is required"),
    dueDate: z.string().min(1, "Due date is required"),
    description: z.string().optional(),
    items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
  })
  .refine(
    (data) => {
      const invoiceDate = new Date(data.date);
      const dueDate = new Date(data.dueDate);
      return dueDate >= invoiceDate;
    },
    {
      message: "Due date cannot be earlier than invoice date",
      path: ["dueDate"],
    },
  );

type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface InvoiceFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function InvoiceForm({ onSuccess, onCancel }: InvoiceFormProps) {
  const createInvoice = useCreateInvoice();

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      customer: "",
      date: new Date().toISOString().split("T")[0],
      dueDate: "",
      description: "",
      items: [{ item: "", qty: 1, price: 0 }],
    },
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchItems = watch("items");

  // Calculate total
  const total =
    watchItems?.reduce((sum, item) => {
      const qty = Number(item.qty) || 0;
      const price = Number(item.price) || 0;
      return sum + qty * price;
    }, 0) ?? 0;

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      const invoiceData: CreateInvoiceData = {
        customer: data.customer,
        date: data.date,
        dueDate: data.dueDate,
        description: data.description,
        items: data.items.map((item) => ({
          item: item.item,
          qty: Number(item.qty),
          price: Number(item.price),
        })),
      };

      await createInvoice.mutateAsync(invoiceData);
      toast.success("Invoice created successfully!");
      onSuccess?.();
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to create invoice";
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Customer & Dates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customer">
            Customer <span className="text-red-500">*</span>
          </Label>
          <Input
            id="customer"
            placeholder="Customer name"
            {...register("customer")}
            className={errors.customer ? "border-red-500" : ""}
          />
          {errors.customer && (
            <p className="text-sm text-red-500">{errors.customer.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">
            Invoice Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="date"
            type="date"
            {...register("date")}
            className={errors.date ? "border-red-500" : ""}
          />
          {errors.date && (
            <p className="text-sm text-red-500">{errors.date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">
            Due Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="dueDate"
            type="date"
            {...register("dueDate")}
            className={errors.dueDate ? "border-red-500" : ""}
          />
          {errors.dueDate && (
            <p className="text-sm text-red-500">{errors.dueDate.message}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="Optional description"
          {...register("description")}
        />
      </div>

      {/* Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>
            Items <span className="text-red-500">*</span>
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ item: "", qty: 1, price: 0 })}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
        </div>

        {errors.items && !Array.isArray(errors.items) && (
          <p className="text-sm text-red-500">{errors.items.message}</p>
        )}

        <div className="space-y-3">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-500">
            <div className="col-span-5">Item Name</div>
            <div className="col-span-2">Qty</div>
            <div className="col-span-3">Price</div>
            <div className="col-span-1">Total</div>
            <div className="col-span-1"></div>
          </div>

          {/* Rows */}
          {fields.map((field, index) => {
            const qty = Number(watchItems?.[index]?.qty) || 0;
            const price = Number(watchItems?.[index]?.price) || 0;
            const rowTotal = qty * price;

            return (
              <div
                key={field.id}
                className="grid grid-cols-12 gap-2 items-start"
              >
                <div className="col-span-5">
                  <Input
                    placeholder="Item name"
                    {...register(`items.${index}.item`)}
                    className={
                      errors.items?.[index]?.item ? "border-red-500" : ""
                    }
                  />
                  {errors.items?.[index]?.item && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.items[index]?.item?.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    {...register(`items.${index}.qty`, { valueAsNumber: true })}
                    className={
                      errors.items?.[index]?.qty ? "border-red-500" : ""
                    }
                  />
                  {errors.items?.[index]?.qty && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.items[index]?.qty?.message}
                    </p>
                  )}
                </div>
                <div className="col-span-3">
                  <Input
                    type="number"
                    placeholder="Price"
                    {...register(`items.${index}.price`, {
                      valueAsNumber: true,
                    })}
                    className={
                      errors.items?.[index]?.price ? "border-red-500" : ""
                    }
                  />
                  {errors.items?.[index]?.price && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.items[index]?.price?.message}
                    </p>
                  )}
                </div>
                <div className="col-span-1 flex items-center h-10 text-sm font-medium">
                  ${rowTotal.toFixed(2)}
                </div>
                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    className="h-10 w-10 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total */}
        <div className="flex justify-end border-t pt-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-2xl font-bold">${total.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={createInvoice.isPending}
          className="bg-my-app-primary hover:bg-my-app-primary/90"
        >
          {createInvoice.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Create Invoice
        </Button>
      </div>
    </form>
  );
}
