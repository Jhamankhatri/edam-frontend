import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { Badge, StatusBadge } from './badge';
import { Button } from './button';
import { ConfirmDialog } from './dialog';
import { FormField } from '@/components/forms/FormField';
import { Input } from './input';
import { PasswordInput } from './password-input';
import { SelectField } from './select';
import { Skeleton } from './skeleton';
import { Table, TableWrapper } from './table';

describe('reusable design-system components', () => {
  it('renders accessible buttons with loading and disabled states', () => {
    render(
      <Button loading onClick={vi.fn()}>
        Save
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('toggles password visibility with an accessible label', async () => {
    const user = userEvent.setup();
    render(<PasswordInput aria-label="Secret" />);
    const input = screen.getByLabelText('Secret');
    expect(input).toHaveAttribute('type', 'password');
    await user.click(screen.getByRole('button', { name: 'Show password' }));
    expect(input).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument();
  });

  it('associates form labels and validation errors', () => {
    render(
      <FormField id="email" label="Work email" error="Enter a valid email.">
        <Input id="email" invalid />
      </FormField>,
    );
    expect(screen.getByLabelText('Work email')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email.');
  });

  it('renders semantic alerts, badges and skeletons', () => {
    const { container } = render(
      <>
        <Alert variant="destructive">
          <AlertTitle>Unable to save</AlertTitle>
          <AlertDescription>Check the highlighted fields.</AlertDescription>
        </Alert>
        <Badge variant="outline">Draft</Badge>
        <StatusBadge label="Approved" variant="success" />
        <Skeleton data-testid="skeleton" />
      </>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Unable to save');
    expect(screen.getByText('Draft')).toBeInTheDocument();
    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton')).toHaveAttribute('aria-hidden', 'true');
    expect(container).toBeInTheDocument();
  });

  it('supports responsive table scrolling without guessing column widths', () => {
    const { container } = render(
      <TableWrapper>
        <Table>
          <tbody>
            <tr>
              <td>Cell</td>
            </tr>
          </tbody>
        </Table>
      </TableWrapper>,
    );
    const wrapper = container.firstElementChild;
    expect(wrapper).toHaveClass('overflow-x-auto', 'max-w-full');
    expect(screen.getByRole('table')).toHaveClass('min-w-table');
  });

  it('renders select and confirmation dialog actions as functional controls', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <>
        <SelectField
          aria-label="Choose status"
          options={[
            { value: 'draft', label: 'Draft' },
            { value: 'approved', label: 'Approved' },
          ]}
        />
        <ConfirmDialog
          open
          onOpenChange={onOpenChange}
          title="Confirm action"
          description="This action is explicit."
          onConfirm={onConfirm}
        />
      </>,
    );

    expect(screen.getByLabelText('Choose status')).toHaveAttribute('role', 'combobox');
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('Confirm action')).toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: 'Confirm' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
