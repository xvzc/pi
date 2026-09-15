{ pkgs, ... }:
{
  packages = with pkgs; [
    nixd
    nixfmt
    typescript-language-server
  ];

  enterShell = # sh
    ''
      export name="devenv:pi"
    '';
}
