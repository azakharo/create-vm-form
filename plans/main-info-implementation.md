# Implementation Plan: Main Information Section for VM Creation Form

## Overview
This plan outlines the implementation of the "Main Information" (Основная информация) section for the VM creation form, as specified in [`doc/1_main.md`](../doc/1_main.md).

## Current State Analysis

### Existing Files
- **[`src/pages/vm/create.tsx`](../src/pages/vm/create.tsx)**: Main form page with Ant Design Form component
  - Uses `Form.useForm<CreateVmFormValues>()` for form instance
  - Has placeholder div for form sections
  - Initial values: `{ name: '' }`
  - Vertical layout with submit/cancel buttons

- **[`src/pages/vm/types.ts`](../src/pages/vm/types.ts)**: Type definitions
  - Currently only has `name: string` in `CreateVmFormValues` interface

## Requirements Summary

### Fields to Implement
| Field | Type | Required | Initial Value | Validation |
|-------|------|----------|---------------|------------|
| Имя (Name) | Text input | Yes | Empty string | Required only |
| Описание (Description) | Text area | No | Empty string | Optional |
| Количество CPU (CPU count) | Integer input | Yes | 1 | Required, min: 1, max: 10 |
| Объём RAM (RAM size) | Integer input | Yes | 4 | Required, min: 1, max: 256 |

### Implementation Decisions
1. **Form Context**: Use `Form.useFormContext()` to access parent form
2. **Visual Container**: Use Ant Design Card component
3. **RAM Display**: Show "GB" in the label
4. **Textarea**: Use Ant Design's `autoSize` prop with minimum 2 rows
5. **Component Location**: Create in `src/pages/vm/MainInfo/` folder

## Implementation Steps

### Step 1: Extend CreateVmFormValues Interface
**File**: [`src/pages/vm/types.ts`](../src/pages/vm/types.ts)

Add new fields to the interface:
```typescript
export interface CreateVmFormValues {
  name: string;
  description?: string;
  cpuCount: number;
  ramSize: number;
}
```

### Step 2: Create MainInfo Component Structure
**Directory**: `src/pages/vm/MainInfo/`
**File**: `src/pages/vm/MainInfo/index.tsx`

Component structure:
- Import necessary Ant Design components (Card, Typography, Form, InputNumber, Input)
- Use `Form.useFormContext()` to access parent form
- Export named component `MainInfo`

### Step 3: Implement MainInfo Component
**File**: `src/pages/vm/MainInfo/index.tsx`

Component implementation:
1. Wrap content in Card component
2. Add title: "Основная информация"
3. Add subtitle: "Заполните обязательные поля для создания виртуальной машины"
4. Implement four Form.Item fields:

**Field 1: Name (Имя)**
- Type: Input.Text
- Required: Yes
- Validation: Required only
- Initial value: Empty string

**Field 2: Description (Описание)**
- Type: Input.TextArea
- Required: No
- Validation: None (optional)
- Initial value: Empty string
- Props: `autoSize={{ minRows: 2 }}`

**Field 3: CPU Count (Количество CPU)**
- Type: InputNumber
- Required: Yes
- Validation: Required, min: 1, max: 10
- Initial value: 1
- Props: `min={1}`, `max={10}`, `style={{ width: '100%' }}`

**Field 4: RAM Size (Объём RAM)**
- Type: InputNumber
- Required: Yes
- Validation: Required, min: 1, max: 256
- Initial value: 4
- Label: "Объём RAM (GB)"
- Props: `min={1}`, `max={256}`, `style={{ width: '100%' }}`

### Step 4: Update create.tsx to Integrate MainInfo
**File**: [`src/pages/vm/create.tsx`](../src/pages/vm/create.tsx)

Changes needed:
1. Import MainInfo component
2. Wrap Form with Form.Provider to enable Form.useFormContext()
3. Replace placeholder div with MainInfo component
4. Update initialValues to include all new fields

Updated initialValues:
```typescript
initialValues={{
  name: '',
  description: '',
  cpuCount: 1,
  ramSize: 4,
}}
```

### Step 5: Testing and Validation
1. Run TypeScript compilation: `npm run ts`
2. Fix any TypeScript errors
3. Run linting: `npm run lint`
4. Fix any linting issues
5. Verify form renders correctly
6. Test validation rules
7. Test form submission

## File Structure After Implementation

```
src/pages/vm/
├── create.tsx          (updated)
├── types.ts            (updated)
└── MainInfo/
    └── index.tsx       (new)
```

## Technical Considerations

### Form Context Usage
- `Form.useFormContext()` requires the parent Form to be wrapped in `Form.Provider`
- This allows child components to access the form instance without prop drilling
- The MainInfo component will use this to access form methods

### Validation Implementation
- Use Ant Design's built-in validation rules
- CPU count: `rules={[{ required: true, type: 'number', min: 1, max: 10 }]}`
- RAM size: `rules={[{ required: true, type: 'number', min: 1, max: 256 }]}`
- Name: `rules={[{ required: true }]}`
- Description: No validation rules (optional field)

### Auto-resize Textarea
- Use Ant Design's `autoSize` prop on Input.TextArea
- Configuration: `autoSize={{ minRows: 2 }}`
- This allows the textarea to grow as user types more content

### Component Export
- Use named export for MainInfo component (as per project rules)
- Export: `export const MainInfo = () => { ... }`

## Assumptions Made

1. The form will use Russian labels as specified in the requirements
2. Error messages will use Ant Design's default messages (in Russian based on locale)
3. The Card component will use default styling without custom props
4. The MainInfo component will not receive any props (uses Form.useFormContext)
5. The form submission logic in create.tsx will remain unchanged

## Success Criteria

- [x] MainInfo component created in correct location
- [x] All four fields implemented with correct types and validation
- [x] Form context properly configured
- [x] Initial values set correctly
- [x] TypeScript compilation passes without errors
- [x] Linting passes without issues
- [x] Form renders correctly in browser
- [x] Validation works as expected
- [x] Textarea auto-resizes properly
