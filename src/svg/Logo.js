import { useTheme } from '@material-ui/core/styles'

export default function LogoSvg(props) {
  const theme = useTheme()

  const fill_color = props.inverted ? "#fff" : theme.palette.secondary.main

  return (
    <svg width="966" height="200" viewBox="0 0 966 200" fill="none" {...props}>
      <g>
        <path d="M65.71 20.27C60.94 20.27 59.18 16.66 57.9 14.93C57.44 14.3 48.02 1.09999 47.56 0.469992H4.86002C4.16091 0.444031 3.46522 0.57963 2.82703 0.866255C2.18884 1.15288 1.62536 1.58281 1.18035 2.12263C0.735338 2.66244 0.420805 3.29761 0.261188 3.97875C0.101571 4.65989 0.101161 5.36867 0.260013 6.04999L2.76001 20.27L6.76001 42.89L33.69 195.3L41.14 171.3L100.58 20.3L65.71 20.27Z" fill="#00B5D3" />
        <path d="M55.66 60.32C60.1134 33.6533 75.0867 20.32 100.58 20.32H168.15C174.523 20.32 177.137 23.6533 175.99 30.32C174.957 36.9867 171.26 40.32 164.9 40.32H135.58C122.833 40.32 115.31 46.9867 113.01 60.32L111.29 70.32C110.137 76.9867 112.75 80.32 119.13 80.32H152.43C158.803 80.32 161.417 83.6533 160.27 90.32C159.243 96.9867 155.543 100.32 149.17 100.32H115.88C109.507 100.32 105.743 103.653 104.59 110.32L91.03 190.32C90.0034 196.987 86.3067 200.32 79.94 200.32H41.7C35.32 200.32 32.6534 196.987 33.7 190.32L55.66 60.32Z" fill={fill_color} />
        <path d="M658.59 140.34H687.26C693.633 140.34 696.3 143.673 695.26 150.34L691 175.26C690.51 178.07 688.78 180.34 685.18 180.34H661.45C642.33 180.34 633.92 173.673 636.22 160.34C638.38 147.007 645.837 140.34 658.59 140.34V140.34ZM726.07 80.34H640.68C634.32 80.34 630.55 83.68 629.41 90.34C628.27 97 631.06 100.34 637.41 100.34H694.11C700.49 100.34 703.103 103.673 701.95 110.34C700.797 117.007 697.04 120.34 690.68 120.34H623.78C598.287 120.34 583.317 133.673 578.87 160.34C574.423 187.007 584.933 200.34 610.4 200.34H734.67C741.05 200.34 744.747 197.007 745.76 190.34L757.62 120.34C762.08 93.6733 751.563 80.34 726.07 80.34Z" fill={fill_color} />
        <path d="M203.46 140.34H232.14C238.5 140.34 241.19 143.68 240.14 150.34L235.86 175.26C235.37 178.07 233.64 180.34 230.04 180.34H206.32C187.207 180.34 178.797 173.673 181.09 160.34C183.25 147.007 190.707 140.34 203.46 140.34V140.34ZM270.95 80.34H206C199.627 80.34 195.867 83.6733 194.72 90.34C193.7 97.0067 196.367 100.34 202.72 100.34H239C245.373 100.34 247.983 103.673 246.83 110.34C245.677 117.007 241.92 120.34 235.56 120.34H168.66C143.16 120.34 128.183 133.673 123.73 160.34C119.277 187.007 129.79 200.34 155.27 200.34H279.54C285.92 200.34 289.617 197.007 290.63 190.34L302.49 120.34C306.957 93.6733 296.443 80.34 270.95 80.34Z" fill={fill_color} />
        <path d="M317.78 200.35C311.42 200.35 308.753 197.017 309.78 190.35L321.65 120.35C326.11 93.6833 341.087 80.35 366.58 80.35H462.17C487.663 80.35 498.177 93.6833 493.71 120.35L481.86 190.35C480.84 197.017 477.143 200.35 470.77 200.35H432.5C426.12 200.35 423.453 197.017 424.5 190.35L436.35 120.35C438.65 107.017 433.42 100.35 420.66 100.35H401.53C388.783 100.35 381.263 107.017 378.97 120.35L367.11 190.35C366.11 197.02 362.41 200.35 356.03 200.35H317.78Z" fill={fill_color} />
        <path d="M509 200.35C502.627 200.35 499.96 197.017 501 190.35L517.83 90.35C518.97 83.6833 522.727 80.35 529.1 80.35H567.34C573.72 80.35 576.333 83.6833 575.18 90.35L558.36 190.35C557.333 197.017 553.637 200.35 547.27 200.35H509Z" fill={fill_color} />
        <path d="M585.26 30.29C584.11 36.96 580.26 40.29 573.89 40.29H535.65C529.28 40.29 526.76 36.99 527.91 30.29C529.06 23.59 532.82 20.29 539.19 20.29H577.42C583.8 20.29 586.413 23.6233 585.26 30.29Z" fill={fill_color} />
        <path d="M772.91 200.35C766.543 200.35 763.877 197.017 764.91 190.35L781.75 90.35C782.89 83.6833 786.643 80.35 793.01 80.35H831.26C837.64 80.35 840.253 83.6833 839.1 90.35L822.27 190.35C821.25 197.017 817.557 200.35 811.19 200.35H772.91Z" fill={fill_color} />
        <path d="M962 80.31H918.64C913.684 80.3567 908.897 82.1242 905.1 85.31L842.16 135.31C839.69 137.31 838.93 141.74 840.71 143.8L886.48 195.18C887.951 196.854 889.773 198.182 891.816 199.071C893.859 199.959 896.073 200.386 898.3 200.32H941.66C946.48 200.32 947.357 198.607 944.29 195.18L898.52 143.8C895.13 140.27 895.24 139.14 899.95 135.31L962.95 85.31C967.157 81.9767 966.857 80.31 962.05 80.31" fill={fill_color} />
      </g>
    </svg>
  )
}