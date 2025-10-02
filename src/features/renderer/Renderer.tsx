import React, { useState, useCallback } from 'react';
import type { RendererProps, ParentNode } from './rendererTypes';
import { Button, Checkbox, Container, Icon, Image, Input, List, ListItem, Loader, Radio, Select, Switch, Text } from 'rkitech-components';

const componentMap: Record<string, React.ComponentType<any>> = {
  Button,
  Checkbox,
  Container,
  Icon,
  Image,
  Input,
  List,
  ListItem,
  Loader,
  Radio,
  Select,
  Switch,
  Text,
};

export const Renderer: React.FC<RendererProps> = ({ tree }) => {
  const [componentState, setComponentState] = useState<Record<string, any>>({});

  const getStateKey = (node: ParentNode, index: number): string => {
    return node.stateId || `${node.type}-${index}`;
  };

  const updateComponentState = useCallback((stateId: string, value: any) => {
    setComponentState(prev => ({
      ...prev,
      [stateId]: value
    }));
  }, []);

  const getComponentState = (stateId: string, defaultValue?: any) => {
    return componentState[stateId] ?? defaultValue;
  };

  const renderNode = (node: ParentNode, index: number = 0): React.ReactNode => {
    if (!node || !node.type) {
      console.warn('Invalid node:', node);
      return null;
    }

    const Component = componentMap[node.type];
    
    if (!Component) {
      console.warn(`Component type "${node.type}" not found in component map`);
      return null;
    }

    const { children, type, stateId, statePath, ...props } = node as ParentNode & { stateId?: string; statePath?: string };
    const componentProps: Record<string, any> = { ...props, key: index };
    const uniqueStateKey = getStateKey(node, index);

    if (type === 'Input') {
      const currentValue = getComponentState(uniqueStateKey, props.value || '');
      componentProps.value = currentValue;
      componentProps.onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateComponentState(uniqueStateKey, e.target.value);
        if (props.onChange) {
          props.onChange(e);
        }
      };
    }

    if (type === 'Checkbox') {
      const currentChecked = getComponentState(uniqueStateKey, props.checked || false);
      componentProps.checked = currentChecked;
      componentProps.onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateComponentState(uniqueStateKey, e.target.checked);
        if (props.onChange) {
          props.onChange(e);
        }
      };
    }

    if (type === 'Switch') {
      const currentChecked = getComponentState(uniqueStateKey, props.checked || false);
      componentProps.checked = currentChecked;
      componentProps.onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateComponentState(uniqueStateKey, e.target.checked);
        if (props.onChange) {
          props.onChange(e);
        }
      };
    }

    if (type === 'Radio') {
      const currentChecked = getComponentState(uniqueStateKey, props.checked || false);
      componentProps.checked = currentChecked;
      componentProps.onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateComponentState(uniqueStateKey, e.target.checked);
        if (props.onChange) {
          props.onChange(e);
        }
      };
    }

    if (type === 'Select') {
        const currentValue = getComponentState(uniqueStateKey, props.value || '');
        componentProps.value = currentValue;
        componentProps.onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            updateComponentState(uniqueStateKey, e.target.value);
            if (props.onChange) props.onChange(e);
        };

        if (children && Array.isArray(children)) {
            componentProps.children = children.map((child, idx) => {
            if (child.type === 'Text') {
                return (
                <option key={idx} value={child.text}>
                    {child.text}
                </option>
                );
            }
            if (child.type === 'Option') {
                return (
                <option key={idx} value={child.value}>
                    {child.label}
                </option>
                );
            }
            return null; 
            });
        }
    }

    if (type === 'Text' && props.text) {
      let processedText = props.text;
      
      const stateReferences = props.text.match(/\{\{([^}]+)\}\}/g);
      if (stateReferences) {
        stateReferences.forEach((ref: string) => {
          const stateKey = ref.replace(/\{\{|\}\}/g, '').trim();
          const stateValue = getComponentState(stateKey, '');
          processedText = processedText.replace(ref, stateValue);
        });
      }
      
      componentProps.text = processedText;
    }

    if (type === 'Button') {
        componentProps.onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            if (props.onClick) {
            props.onClick(componentState, e); 
            }
        };
    }
    if (children && Array.isArray(children)) {
      if (['Container', 'Button', 'List', 'ListItem'].includes(type)) {
        componentProps.children = children.map((child, idx) => renderNode(child, idx));
      }
    }

    if (type === 'Text' && !componentProps.text) {
      console.warn('Text component missing required "text" prop');
      return null;
    }

    if (type === 'Icon' && !componentProps.iconName) {
      console.warn('Icon component missing required "iconName" prop');
      return null;
    }

    if (type === 'Image' && !componentProps.src) {
      console.warn('Image component missing required "src" prop');
      return null;
    }

    if (type === 'Loader') {
      if (componentProps.show === undefined) componentProps.show = true;
      if (!componentProps.loaderType) componentProps.loaderType = 'Spinner';
      if (componentProps.variant === undefined) componentProps.variant = 1;
    }

    return <Component {...componentProps} />;
  };

  return <>{renderNode(tree)}</>;
};

export default Renderer;