// Type declarations for dash-button web component
declare namespace JSX {
  interface IntrinsicElements {
    'dash-button': {
      title?: string;
      value?: string | number;
      icon?: string;
      color?: string;
      'background-color'?: string;
      'text-color'?: string;
      'value-color'?: string;
      'icon-color'?: string;
      size?: 'small' | 'medium' | 'large';
      onClick?: () => void;
      children?: React.ReactNode;
    };
  }
}