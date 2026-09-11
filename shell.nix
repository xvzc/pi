{
  pkgs ? import <nixpkgs> { },
}:
pkgs.mkShell {
  packages = with pkgs; [
    nixd
    nixfmt-rfc-style
    typescript-language-server
  ];

  shellHook = # sh
    ''
      export name="nix:pi"
    '';
}
