import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QuantitySelector from '../../components/product/QuantitySelector';

describe('QuantitySelector', () => {
  it('renders with initial quantity', () => {
    render(<QuantitySelector quantity={5} onChange={() => {}} />);
    const input = screen.getByRole('spinbutton');
    expect(input.value).toBe('5');
  });

  it('calls onChange when + button is clicked', () => {
    const onChange = vi.fn();
    render(<QuantitySelector quantity={3} onChange={onChange} max={10} />);

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[1]); // + button is second

    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('calls onChange when - button is clicked', () => {
    const onChange = vi.fn();
    render(<QuantitySelector quantity={3} onChange={onChange} min={1} />);

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]); // - button is first

    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('disables - button at minimum', () => {
    const onChange = vi.fn();
    render(<QuantitySelector quantity={1} onChange={onChange} min={1} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toBeDisabled();
  });

  it('disables + button at maximum', () => {
    const onChange = vi.fn();
    render(<QuantitySelector quantity={10} onChange={onChange} max={10} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons[1]).toBeDisabled();
  });

  it('shows error when typing value above max', () => {
    const onChange = vi.fn();
    render(<QuantitySelector quantity={5} onChange={onChange} max={10} />);

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '15' } });

    expect(screen.getByText('Only 10 available')).toBeInTheDocument();
  });

  it('shows error when typing value below min', () => {
    const onChange = vi.fn();
    render(<QuantitySelector quantity={5} onChange={onChange} min={2} />);

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '1' } });

    expect(screen.getByText('Minimum quantity is 2')).toBeInTheDocument();
  });

  it('updates input value when typing valid number', () => {
    const onChange = vi.fn();
    render(<QuantitySelector quantity={5} onChange={onChange} max={20} />);

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '12' } });

    expect(onChange).toHaveBeenCalledWith(12);
  });

  it('corrects value on blur when above max', () => {
    const onChange = vi.fn();
    render(<QuantitySelector quantity={5} onChange={onChange} max={10} />);

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '15' } });
    fireEvent.blur(input);

    expect(input.value).toBe('10');
    expect(onChange).toHaveBeenCalledWith(10);
  });

  it('corrects value on blur when below min', () => {
    const onChange = vi.fn();
    render(<QuantitySelector quantity={5} onChange={onChange} min={2} />);

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '0' } });
    fireEvent.blur(input);

    expect(input.value).toBe('2');
    expect(onChange).toHaveBeenCalledWith(2);
  });
});
