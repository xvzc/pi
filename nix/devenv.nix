{ pkgs, ... }:
{
  packages = with pkgs; [
    nixd
    nixfmt
    typescript-language-server
  ];

  enterShell = # sh
    ''
      export PI_CODING_AGENT_DIR="$HOME/.config/pi/agent"
      export name="devenv:pi"
    '';
}
