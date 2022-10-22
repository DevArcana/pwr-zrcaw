import { Component } from "solid-js";
import { css } from "solid-styled";

const Footer: Component = () => {

  css`
    footer {
      padding: var(--size-2);
    }
    
    .center {
      display: flex;
      justify-content: center;
    }
    
    .vertical {
      flex-direction: column;
      align-items: center;
    }
    
    small {
      max-inline-size: unset;
    }
    
    p {
      font-size: var(--size-3);
    }
  `;

  return (
    <footer class="center">
      <div class="center vertical">
        <p>&copy; Copyright 2022 Piotr Krzystanek</p>
        <small>MIT license, you can do you what you want, I don't care.</small>
      </div>
    </footer>
  );
};

export default Footer;