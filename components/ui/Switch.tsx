import React from "react";
import styled from "styled-components";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Switch = ({ checked, onChange }: SwitchProps) => {
  return (
    <StyledWrapper>
      <label className="switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="wrapper">
          <span className="row">
            <span className="dot" />
            <span className="dot" />
          </span>
          <span className="row row-bottom">
            <span className="dot" />
            <span className="dot" />
          </span>
          <span className="row-vertical">
            <span className="dot" />
            <span className="dot middle-dot" />
            <span className="dot" />
          </span>
          <span className="row-horizontal">
            <span className="dot" />
            <span className="dot middle-dot-horizontal" />
            <span className="dot" />
          </span>
        </span>
      </label>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
    display: none;
  }
  .switch {
    width: 25px;
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    cursor: pointer;
  }
  .wrapper {
    width: 25px;
    height: 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: all 0.2s;
  }
  .row {
    width: 100%;
    height: 50%;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
  .row-bottom {
    align-items: flex-end;
  }
  .dot {
    width: 6px;
    height: 6px;
    border: 1.5px solid white;
    border-radius: 50%;
    transition: all 0.2s;
  }
  .row-horizontal {
    position: absolute;
    width: 100%;
    height: fit-content;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.2s;
  }
  .row-vertical {
    position: absolute;
    width: fit-content;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    transition: all 0.2s;
  }

  .switch:hover .wrapper .row-horizontal {
    width: 70px;
  }
  .switch:hover .wrapper .row-vertical {
    height: 70px;
  }

  .switch:hover .wrapper .row-vertical .middle-dot {
    border-radius: 4px;
    height: 25px;
  }
  .switch:hover .wrapper .row-horizontal .middle-dot-horizontal {
    border-radius: 4px;
    width: 25px;
  }
  .switch input:checked + .wrapper {
    transform: rotate(45deg) scale(1.1);
  }
  .switch input:checked + .wrapper .row-vertical {
    height: 70px;
  }
  .switch input:checked + .wrapper .row-horizontal {
    width: 70px;
  }

  .switch input:checked + .wrapper .row-vertical .middle-dot {
    border-radius: 4px;
    height: 25px;
  }
  .switch input:checked + .wrapper .row-horizontal .middle-dot-horizontal {
    border-radius: 4px;
    width: 25px;
  }
`;

export default Switch;
