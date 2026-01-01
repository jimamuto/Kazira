import { render, screen } from '@testing-library/react';
import RoadmapForm from './index';

const mockOnSuccess = jest.fn();
const mockOnStartGeneration = jest.fn();

const defaultProps = {
  onSuccess: mockOnSuccess,
  onStartGeneration: mockOnStartGeneration,
};

describe('RoadmapForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<RoadmapForm {...defaultProps} />);
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });
});