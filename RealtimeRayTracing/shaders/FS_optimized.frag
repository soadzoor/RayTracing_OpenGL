#version 120
struct Ray {
  vec3 origin;
  vec3 dir;
};
struct Material {
  vec3 amb;
  vec3 dif;
  vec3 spec;
  float pow;
  bool refractive;
  bool reflective;
  vec3 f0;
  float n;
};
struct Light {
  vec3 col;
  vec3 pos;
};
struct Plane {
  vec3 n;
  vec3 q;
};
struct Disc {
  vec3 o;
  float r;
  vec3 n;
};
struct Triangle {
  vec3 A;
  vec3 B;
  vec3 C;
};
struct Stack {
  Ray ray;
  vec3 coeff;
  int depth;
};
varying vec3 vsRay;
uniform vec3 eye;
uniform sampler2D sunTexture;
uniform sampler2D earthTexture;
uniform sampler2D earthNormalMap;
uniform sampler2D moonTexture;
uniform sampler2D moonNormalMap;
uniform sampler2D groundTexture;
uniform sampler2D skyboxTextureBack;
uniform sampler2D skyboxTextureDown;
uniform sampler2D skyboxTextureFront;
uniform sampler2D skyboxTextureLeft;
uniform sampler2D skyboxTextureRight;
uniform sampler2D skyboxTextureUp;
uniform Light lights[3];
uniform vec4 spheres[110];
uniform vec2 torus;
uniform Triangle triangles[14];
uniform float time;
uniform float skyboxRatio;
uniform Disc ground;
uniform Plane skyboxBack;
uniform Plane skyboxDown;
uniform Plane skyboxFront;
uniform Plane skyboxLeft;
uniform Plane skyboxRight;
uniform Plane skyboxUp;
uniform int depth;
uniform bool isShadowOn;
uniform bool useNormalMap;
uniform bool isGlowOn;
uniform int colorModeInTernary[3];
void main ()
{
  Ray ray_1;
  ray_1.origin = eye;
  ray_1.dir = normalize(vsRay);
  bool continueLoop_2;
  vec3 coeff_3;
  int bounceCount_4;
  int stackSize_5;
  Stack stack_6[8];
  float v_7;
  float u_8;
  int tmpvar_9;
  float tmpvar_10;
  vec3 tmpvar_11;
  vec3 tmpvar_12;
  vec3 tmpvar_13;
  vec3 color_14;
  color_14 = vec3(0.0, 0.0, 0.0);
  stackSize_5 = 0;
  bounceCount_4 = 1;
  coeff_3 = vec3(1.0, 1.0, 1.0);
  continueLoop_2 = bool(1);
  while (true) {
    if (!(continueLoop_2)) {
      break;
    };
    vec3 tmpvar_15;
    vec3 tmpvar_16;
    tmpvar_15 = ray_1.origin;
    tmpvar_16 = ray_1.dir;
    int tmpvar_17;
    float tmpvar_18;
    vec3 tmpvar_19;
    vec3 tmpvar_20;
    vec3 tmpvar_21;
    tmpvar_17 = tmpvar_9;
    tmpvar_18 = tmpvar_10;
    tmpvar_19 = tmpvar_11;
    tmpvar_20 = tmpvar_12;
    tmpvar_21 = tmpvar_13;
    bool hit_24;
    float minT_25;
    int tmpvar_26;
    float tmpvar_27;
    vec3 tmpvar_28;
    vec3 tmpvar_29;
    vec3 tmpvar_30;
    minT_25 = -1.0;
    hit_24 = bool(0);
    for (int i_23 = 0; i_23 < 110; i_23++) {
      vec4 sphere_31;
      sphere_31 = spheres[i_23];
      int tmpvar_32;
      float tmpvar_33;
      vec3 tmpvar_34;
      vec3 tmpvar_35;
      vec3 tmpvar_36;
      bool tmpvar_37;
      float t_38;
      float t2_39;
      float t1_40;
      vec3 tmpvar_41;
      tmpvar_41 = (tmpvar_15 - sphere_31.xyz);
      float tmpvar_42;
      tmpvar_42 = (dot (tmpvar_41, tmpvar_16) * 2.0);
      float tmpvar_43;
      tmpvar_43 = dot (tmpvar_16, tmpvar_16);
      float tmpvar_44;
      tmpvar_44 = ((tmpvar_42 * tmpvar_42) - ((4.0 * tmpvar_43) * (
        dot (tmpvar_41, tmpvar_41)
       - 
        (sphere_31.w * sphere_31.w)
      )));
      if ((tmpvar_44 < 0.0)) {
        tmpvar_37 = bool(0);
      } else {
        float tmpvar_45;
        tmpvar_45 = sqrt(tmpvar_44);
        float tmpvar_46;
        tmpvar_46 = (((
          -(tmpvar_42)
         + tmpvar_45) / 2.0) / tmpvar_43);
        t1_40 = tmpvar_46;
        float tmpvar_47;
        tmpvar_47 = (((
          -(tmpvar_42)
         - tmpvar_45) / 2.0) / tmpvar_43);
        t2_39 = tmpvar_47;
        if ((tmpvar_46 < 0.001)) {
          t1_40 = -0.001;
        };
        if ((tmpvar_47 < 0.001)) {
          t2_39 = -0.001;
        };
        if ((t1_40 < 0.0)) {
          tmpvar_37 = bool(0);
        } else {
          if ((t2_39 > 0.0)) {
            t_38 = t2_39;
          } else {
            t_38 = t1_40;
          };
          tmpvar_32 = i_23;
          tmpvar_33 = t_38;
          tmpvar_36 = sphere_31.xyz;
          tmpvar_34 = (tmpvar_15 + (t_38 * tmpvar_16));
          tmpvar_35 = normalize((tmpvar_34 - sphere_31.xyz));
          tmpvar_37 = bool(1);
        };
      };
      tmpvar_26 = tmpvar_32;
      tmpvar_27 = tmpvar_33;
      tmpvar_28 = tmpvar_34;
      tmpvar_29 = tmpvar_35;
      tmpvar_30 = tmpvar_36;
      if (tmpvar_37) {
        if (((tmpvar_33 < minT_25) || (minT_25 < 0.0))) {
          minT_25 = tmpvar_33;
          tmpvar_17 = tmpvar_32;
          tmpvar_18 = tmpvar_33;
          tmpvar_19 = tmpvar_34;
          tmpvar_20 = tmpvar_35;
          tmpvar_21 = tmpvar_36;
        };
        hit_24 = bool(1);
      };
    };
    for (int i_22 = 110; i_22 < 124; i_22++) {
      Triangle t_48;
      t_48 = triangles[(i_22 - 110)];
      int tmpvar_49;
      float tmpvar_50;
      vec3 tmpvar_51;
      vec3 tmpvar_52;
      vec3 tmpvar_53;
      bool tmpvar_54;
      float t1_55;
      float v_56;
      float u_57;
      float invDet_58;
      vec3 T_59;
      vec3 e2_60;
      vec3 e1_61;
      e1_61 = (t_48.B - t_48.A);
      e2_60 = (t_48.C - t_48.A);
      vec3 tmpvar_62;
      tmpvar_62 = ((tmpvar_16.yzx * e2_60.zxy) - (tmpvar_16.zxy * e2_60.yzx));
      invDet_58 = (1.0/(dot (e1_61, tmpvar_62)));
      T_59 = (tmpvar_15 - t_48.A);
      u_57 = (dot (T_59, tmpvar_62) * invDet_58);
      if (((u_57 < 0.0) || (u_57 > 1.0))) {
        tmpvar_54 = bool(0);
      } else {
        vec3 tmpvar_63;
        tmpvar_63 = ((T_59.yzx * e1_61.zxy) - (T_59.zxy * e1_61.yzx));
        v_56 = (dot (tmpvar_16, tmpvar_63) * invDet_58);
        if (((v_56 < 0.0) || ((u_57 + v_56) > 1.0))) {
          tmpvar_54 = bool(0);
        } else {
          t1_55 = (dot (e2_60, tmpvar_63) * invDet_58);
          if ((t1_55 > 0.001)) {
            tmpvar_50 = t1_55;
            tmpvar_49 = i_22;
            tmpvar_51 = (tmpvar_15 + (tmpvar_16 * t1_55));
            vec3 a_64;
            a_64 = (t_48.B - t_48.A);
            vec3 b_65;
            b_65 = (t_48.C - t_48.A);
            tmpvar_52 = normalize(((a_64.yzx * b_65.zxy) - (a_64.zxy * b_65.yzx)));
            tmpvar_53 = (((t_48.A + t_48.B) + t_48.C) / 3.0);
            tmpvar_54 = bool(1);
          } else {
            tmpvar_54 = bool(0);
          };
        };
      };
      tmpvar_26 = tmpvar_49;
      tmpvar_27 = tmpvar_50;
      tmpvar_28 = tmpvar_51;
      tmpvar_29 = tmpvar_52;
      tmpvar_30 = tmpvar_53;
      if (tmpvar_54) {
        if (((tmpvar_50 < minT_25) || (minT_25 < 0.0))) {
          minT_25 = tmpvar_50;
          tmpvar_17 = tmpvar_49;
          tmpvar_18 = tmpvar_50;
          tmpvar_19 = tmpvar_51;
          tmpvar_20 = tmpvar_52;
          tmpvar_21 = tmpvar_53;
        };
        hit_24 = bool(1);
      };
    };
    vec3 tmpvar_66;
    float tmpvar_67;
    vec3 tmpvar_68;
    tmpvar_66 = ground.o;
    tmpvar_67 = ground.r;
    tmpvar_68 = ground.n;
    bool tmpvar_69;
    tmpvar_69 = bool(1);
    bool tmpvar_70;
    float tmpvar_71;
    vec3 tmpvar_72;
    vec3 tmpvar_73;
    vec3 tmpvar_74;
    bool tmpvar_75;
    float tmpvar_76;
    tmpvar_76 = (dot (tmpvar_68, (tmpvar_66 - tmpvar_15)) / dot (tmpvar_68, tmpvar_16));
    if ((tmpvar_76 < 0.001)) {
      tmpvar_75 = bool(0);
    } else {
      tmpvar_71 = tmpvar_76;
      tmpvar_74 = tmpvar_66;
      tmpvar_72 = (tmpvar_15 + (tmpvar_76 * tmpvar_16));
      tmpvar_73 = tmpvar_68;
      tmpvar_75 = bool(1);
    };
    if (tmpvar_75) {
      float tmpvar_77;
      vec3 tmpvar_78;
      tmpvar_78 = ((tmpvar_15 + (tmpvar_71 * tmpvar_16)) - tmpvar_66);
      tmpvar_77 = sqrt(dot (tmpvar_78, tmpvar_78));
      if ((tmpvar_77 <= tmpvar_67)) {
        tmpvar_70 = bool(1);
        tmpvar_69 = bool(0);
      };
    };
    if (tmpvar_69) {
      tmpvar_70 = bool(0);
      tmpvar_69 = bool(0);
    };
    tmpvar_26 = 124;
    tmpvar_27 = tmpvar_71;
    tmpvar_28 = tmpvar_72;
    tmpvar_29 = tmpvar_73;
    tmpvar_30 = tmpvar_74;
    if (tmpvar_70) {
      if (((tmpvar_71 < minT_25) || (minT_25 < 0.0))) {
        minT_25 = tmpvar_71;
        tmpvar_17 = 124;
        tmpvar_18 = tmpvar_71;
        tmpvar_19 = tmpvar_72;
        tmpvar_20 = tmpvar_73;
        tmpvar_21 = tmpvar_74;
      };
      hit_24 = bool(1);
    };
    bool tmpvar_79;
    if ((bounceCount_4 > 1)) {
      vec3 tmpvar_80;
      tmpvar_80.yz = tmpvar_15.yz;
      float tmpvar_81;
      vec3 tmpvar_82;
      vec3 tmpvar_83;
      vec3 tmpvar_84;
      bool tmpvar_85;
      tmpvar_85 = bool(1);
      bool tmpvar_86;
      float result_87;
      float d2_88;
      float d1_89;
      float z_90;
      float h_91;
      float r_92;
      float p_93;
      tmpvar_80.x = (tmpvar_15.x - 10.0);
      float tmpvar_94;
      tmpvar_94 = (torus.x * torus.x);
      float tmpvar_95;
      tmpvar_95 = (torus.y * torus.y);
      float tmpvar_96;
      tmpvar_96 = dot (tmpvar_80, tmpvar_16);
      float tmpvar_97;
      tmpvar_97 = (((
        dot (tmpvar_80, tmpvar_80)
       - tmpvar_95) - tmpvar_94) / 2.0);
      float tmpvar_98;
      tmpvar_98 = (((tmpvar_96 * tmpvar_96) + (
        (tmpvar_94 * tmpvar_16.z)
       * tmpvar_16.z)) + tmpvar_97);
      float tmpvar_99;
      tmpvar_99 = ((tmpvar_97 * tmpvar_96) + ((tmpvar_94 * tmpvar_15.z) * tmpvar_16.z));
      float tmpvar_100;
      tmpvar_100 = (((
        (2.0 * tmpvar_96)
       * 
        (tmpvar_96 * tmpvar_96)
      ) - (
        (2.0 * tmpvar_96)
       * tmpvar_98)) + (2.0 * tmpvar_99));
      p_93 = (((
        (-3.0 * tmpvar_96)
       * tmpvar_96) + (2.0 * tmpvar_98)) / 3.0);
      r_92 = (((
        (((-3.0 * tmpvar_96) * ((tmpvar_96 * tmpvar_96) * tmpvar_96)) + ((4.0 * tmpvar_96) * (tmpvar_96 * tmpvar_98)))
       - 
        ((8.0 * tmpvar_96) * tmpvar_99)
      ) + (4.0 * 
        (((tmpvar_97 * tmpvar_97) + ((tmpvar_94 * tmpvar_15.z) * tmpvar_15.z)) - (tmpvar_94 * tmpvar_95))
      )) / 3.0);
      float tmpvar_101;
      tmpvar_101 = ((p_93 * p_93) + r_92);
      float tmpvar_102;
      tmpvar_102 = (((
        (3.0 * r_92)
       * p_93) - (
        (p_93 * p_93)
       * p_93)) - (tmpvar_100 * tmpvar_100));
      float tmpvar_103;
      tmpvar_103 = ((tmpvar_102 * tmpvar_102) - ((tmpvar_101 * tmpvar_101) * tmpvar_101));
      h_91 = tmpvar_103;
      z_90 = 0.0;
      if ((tmpvar_103 < 0.0)) {
        float tmpvar_104;
        tmpvar_104 = sqrt(tmpvar_101);
        float x_105;
        x_105 = (tmpvar_102 / (tmpvar_104 * tmpvar_101));
        z_90 = ((2.0 * tmpvar_104) * cos((
          (1.570796 - (sign(x_105) * (1.570796 - (
            sqrt((1.0 - abs(x_105)))
           * 
            (1.570796 + (abs(x_105) * (-0.2146018 + (
              abs(x_105)
             * 
              (0.08656672 + (abs(x_105) * -0.03102955))
            ))))
          ))))
         / 3.0)));
      } else {
        float tmpvar_106;
        tmpvar_106 = pow ((sqrt(tmpvar_103) + abs(tmpvar_102)), 0.3333333);
        z_90 = (sign(tmpvar_102) * abs((tmpvar_106 + 
          (tmpvar_101 / tmpvar_106)
        )));
      };
      z_90 = (p_93 - z_90);
      float tmpvar_107;
      tmpvar_107 = (z_90 - (3.0 * p_93));
      d1_89 = tmpvar_107;
      float tmpvar_108;
      tmpvar_108 = ((z_90 * z_90) - (3.0 * r_92));
      d2_88 = tmpvar_108;
      float tmpvar_109;
      tmpvar_109 = abs(tmpvar_107);
      if ((tmpvar_109 < 0.001)) {
        if ((tmpvar_108 < 0.0)) {
          tmpvar_86 = bool(0);
          tmpvar_85 = bool(0);
        } else {
          d2_88 = sqrt(tmpvar_108);
        };
      } else {
        if ((tmpvar_107 < 0.0)) {
          tmpvar_86 = bool(0);
          tmpvar_85 = bool(0);
        } else {
          float tmpvar_110;
          tmpvar_110 = sqrt((tmpvar_107 / 2.0));
          d1_89 = tmpvar_110;
          d2_88 = (tmpvar_100 / tmpvar_110);
        };
      };
      if (tmpvar_85) {
        result_87 = 1e+20;
        h_91 = (((d1_89 * d1_89) - z_90) + d2_88);
        if ((h_91 > 0.0)) {
          float tmpvar_111;
          tmpvar_111 = sqrt(h_91);
          h_91 = tmpvar_111;
          float tmpvar_112;
          tmpvar_112 = ((-(d1_89) - tmpvar_111) - tmpvar_96);
          float tmpvar_113;
          tmpvar_113 = ((-(d1_89) + tmpvar_111) - tmpvar_96);
          if ((tmpvar_112 > 0.0)) {
            result_87 = tmpvar_112;
          } else {
            if ((tmpvar_113 > 0.0)) {
              result_87 = tmpvar_113;
            };
          };
        };
        h_91 = (((d1_89 * d1_89) - z_90) - d2_88);
        if ((h_91 > 0.0)) {
          float tmpvar_114;
          tmpvar_114 = sqrt(h_91);
          h_91 = tmpvar_114;
          float tmpvar_115;
          tmpvar_115 = ((d1_89 - tmpvar_114) - tmpvar_96);
          float tmpvar_116;
          tmpvar_116 = ((d1_89 + tmpvar_114) - tmpvar_96);
          if ((tmpvar_115 > 0.0)) {
            result_87 = min (result_87, tmpvar_115);
          } else {
            if ((tmpvar_116 > 0.0)) {
              result_87 = min (result_87, tmpvar_116);
            };
          };
        };
        if (((result_87 > 0.0) && (result_87 < 1000.0))) {
          tmpvar_81 = result_87;
          tmpvar_82 = (tmpvar_80 + (result_87 * tmpvar_16));
          tmpvar_83 = normalize((tmpvar_82 * (
            (dot (tmpvar_82, tmpvar_82) - (torus.y * torus.y))
           - 
            ((torus.x * torus.x) * vec3(1.0, 1.0, -1.0))
          )));
          tmpvar_86 = bool(1);
          tmpvar_85 = bool(0);
        } else {
          tmpvar_86 = bool(0);
          tmpvar_85 = bool(0);
        };
      };
      tmpvar_26 = 125;
      tmpvar_27 = tmpvar_81;
      tmpvar_28 = tmpvar_82;
      tmpvar_29 = tmpvar_83;
      tmpvar_30 = tmpvar_84;
      tmpvar_79 = tmpvar_86;
    } else {
      tmpvar_79 = bool(0);
    };
    if (tmpvar_79) {
      if (((tmpvar_27 < minT_25) || (minT_25 < 0.0))) {
        minT_25 = tmpvar_27;
        tmpvar_17 = tmpvar_26;
        tmpvar_18 = tmpvar_27;
        tmpvar_19 = tmpvar_28;
        tmpvar_20 = tmpvar_29;
        tmpvar_21 = tmpvar_30;
      };
      hit_24 = bool(1);
    };
    vec3 tmpvar_117;
    vec3 tmpvar_118;
    tmpvar_117 = skyboxBack.n;
    tmpvar_118 = skyboxBack.q;
    float tmpvar_119;
    vec3 tmpvar_120;
    vec3 tmpvar_121;
    vec3 tmpvar_122;
    bool tmpvar_123;
    float tmpvar_124;
    tmpvar_124 = (dot (tmpvar_117, (tmpvar_118 - tmpvar_15)) / dot (tmpvar_117, tmpvar_16));
    if ((tmpvar_124 < 0.001)) {
      tmpvar_123 = bool(0);
    } else {
      tmpvar_119 = tmpvar_124;
      tmpvar_122 = tmpvar_118;
      tmpvar_120 = (tmpvar_15 + (tmpvar_124 * tmpvar_16));
      tmpvar_121 = tmpvar_117;
      tmpvar_123 = bool(1);
    };
    tmpvar_26 = 126;
    tmpvar_27 = tmpvar_119;
    tmpvar_28 = tmpvar_120;
    tmpvar_29 = tmpvar_121;
    tmpvar_30 = tmpvar_122;
    if (tmpvar_123) {
      if (((tmpvar_119 < minT_25) || (minT_25 < 0.0))) {
        minT_25 = tmpvar_119;
        tmpvar_17 = 126;
        tmpvar_18 = tmpvar_119;
        tmpvar_19 = tmpvar_120;
        tmpvar_20 = tmpvar_121;
        tmpvar_21 = tmpvar_122;
      };
      hit_24 = bool(1);
    };
    vec3 tmpvar_125;
    vec3 tmpvar_126;
    tmpvar_125 = skyboxDown.n;
    tmpvar_126 = skyboxDown.q;
    float tmpvar_127;
    vec3 tmpvar_128;
    vec3 tmpvar_129;
    vec3 tmpvar_130;
    bool tmpvar_131;
    float tmpvar_132;
    tmpvar_132 = (dot (tmpvar_125, (tmpvar_126 - tmpvar_15)) / dot (tmpvar_125, tmpvar_16));
    if ((tmpvar_132 < 0.001)) {
      tmpvar_131 = bool(0);
    } else {
      tmpvar_127 = tmpvar_132;
      tmpvar_130 = tmpvar_126;
      tmpvar_128 = (tmpvar_15 + (tmpvar_132 * tmpvar_16));
      tmpvar_129 = tmpvar_125;
      tmpvar_131 = bool(1);
    };
    tmpvar_26 = 127;
    tmpvar_27 = tmpvar_127;
    tmpvar_28 = tmpvar_128;
    tmpvar_29 = tmpvar_129;
    tmpvar_30 = tmpvar_130;
    if (tmpvar_131) {
      if (((tmpvar_127 < minT_25) || (minT_25 < 0.0))) {
        minT_25 = tmpvar_127;
        tmpvar_17 = 127;
        tmpvar_18 = tmpvar_127;
        tmpvar_19 = tmpvar_128;
        tmpvar_20 = tmpvar_129;
        tmpvar_21 = tmpvar_130;
      };
      hit_24 = bool(1);
    };
    vec3 tmpvar_133;
    vec3 tmpvar_134;
    tmpvar_133 = skyboxFront.n;
    tmpvar_134 = skyboxFront.q;
    float tmpvar_135;
    vec3 tmpvar_136;
    vec3 tmpvar_137;
    vec3 tmpvar_138;
    bool tmpvar_139;
    float tmpvar_140;
    tmpvar_140 = (dot (tmpvar_133, (tmpvar_134 - tmpvar_15)) / dot (tmpvar_133, tmpvar_16));
    if ((tmpvar_140 < 0.001)) {
      tmpvar_139 = bool(0);
    } else {
      tmpvar_135 = tmpvar_140;
      tmpvar_138 = tmpvar_134;
      tmpvar_136 = (tmpvar_15 + (tmpvar_140 * tmpvar_16));
      tmpvar_137 = tmpvar_133;
      tmpvar_139 = bool(1);
    };
    tmpvar_26 = 128;
    tmpvar_27 = tmpvar_135;
    tmpvar_28 = tmpvar_136;
    tmpvar_29 = tmpvar_137;
    tmpvar_30 = tmpvar_138;
    if (tmpvar_139) {
      if (((tmpvar_135 < minT_25) || (minT_25 < 0.0))) {
        minT_25 = tmpvar_135;
        tmpvar_17 = 128;
        tmpvar_18 = tmpvar_135;
        tmpvar_19 = tmpvar_136;
        tmpvar_20 = tmpvar_137;
        tmpvar_21 = tmpvar_138;
      };
      hit_24 = bool(1);
    };
    vec3 tmpvar_141;
    vec3 tmpvar_142;
    tmpvar_141 = skyboxLeft.n;
    tmpvar_142 = skyboxLeft.q;
    float tmpvar_143;
    vec3 tmpvar_144;
    vec3 tmpvar_145;
    vec3 tmpvar_146;
    bool tmpvar_147;
    float tmpvar_148;
    tmpvar_148 = (dot (tmpvar_141, (tmpvar_142 - tmpvar_15)) / dot (tmpvar_141, tmpvar_16));
    if ((tmpvar_148 < 0.001)) {
      tmpvar_147 = bool(0);
    } else {
      tmpvar_143 = tmpvar_148;
      tmpvar_146 = tmpvar_142;
      tmpvar_144 = (tmpvar_15 + (tmpvar_148 * tmpvar_16));
      tmpvar_145 = tmpvar_141;
      tmpvar_147 = bool(1);
    };
    tmpvar_26 = 129;
    tmpvar_27 = tmpvar_143;
    tmpvar_28 = tmpvar_144;
    tmpvar_29 = tmpvar_145;
    tmpvar_30 = tmpvar_146;
    if (tmpvar_147) {
      if (((tmpvar_143 < minT_25) || (minT_25 < 0.0))) {
        minT_25 = tmpvar_143;
        tmpvar_17 = 129;
        tmpvar_18 = tmpvar_143;
        tmpvar_19 = tmpvar_144;
        tmpvar_20 = tmpvar_145;
        tmpvar_21 = tmpvar_146;
      };
      hit_24 = bool(1);
    };
    vec3 tmpvar_149;
    vec3 tmpvar_150;
    tmpvar_149 = skyboxRight.n;
    tmpvar_150 = skyboxRight.q;
    float tmpvar_151;
    vec3 tmpvar_152;
    vec3 tmpvar_153;
    vec3 tmpvar_154;
    bool tmpvar_155;
    float tmpvar_156;
    tmpvar_156 = (dot (tmpvar_149, (tmpvar_150 - tmpvar_15)) / dot (tmpvar_149, tmpvar_16));
    if ((tmpvar_156 < 0.001)) {
      tmpvar_155 = bool(0);
    } else {
      tmpvar_151 = tmpvar_156;
      tmpvar_154 = tmpvar_150;
      tmpvar_152 = (tmpvar_15 + (tmpvar_156 * tmpvar_16));
      tmpvar_153 = tmpvar_149;
      tmpvar_155 = bool(1);
    };
    tmpvar_26 = 130;
    tmpvar_27 = tmpvar_151;
    tmpvar_28 = tmpvar_152;
    tmpvar_29 = tmpvar_153;
    tmpvar_30 = tmpvar_154;
    if (tmpvar_155) {
      if (((tmpvar_151 < minT_25) || (minT_25 < 0.0))) {
        minT_25 = tmpvar_151;
        tmpvar_17 = 130;
        tmpvar_18 = tmpvar_151;
        tmpvar_19 = tmpvar_152;
        tmpvar_20 = tmpvar_153;
        tmpvar_21 = tmpvar_154;
      };
      hit_24 = bool(1);
    };
    vec3 tmpvar_157;
    vec3 tmpvar_158;
    tmpvar_157 = skyboxUp.n;
    tmpvar_158 = skyboxUp.q;
    float tmpvar_159;
    vec3 tmpvar_160;
    vec3 tmpvar_161;
    vec3 tmpvar_162;
    bool tmpvar_163;
    float tmpvar_164;
    tmpvar_164 = (dot (tmpvar_157, (tmpvar_158 - tmpvar_15)) / dot (tmpvar_157, tmpvar_16));
    if ((tmpvar_164 < 0.001)) {
      tmpvar_163 = bool(0);
    } else {
      tmpvar_159 = tmpvar_164;
      tmpvar_162 = tmpvar_158;
      tmpvar_160 = (tmpvar_15 + (tmpvar_164 * tmpvar_16));
      tmpvar_161 = tmpvar_157;
      tmpvar_163 = bool(1);
    };
    tmpvar_26 = 131;
    tmpvar_27 = tmpvar_159;
    tmpvar_28 = tmpvar_160;
    tmpvar_29 = tmpvar_161;
    tmpvar_30 = tmpvar_162;
    if (tmpvar_163) {
      if (((tmpvar_159 < minT_25) || (minT_25 < 0.0))) {
        minT_25 = tmpvar_159;
        tmpvar_17 = 131;
        tmpvar_18 = tmpvar_159;
        tmpvar_19 = tmpvar_160;
        tmpvar_20 = tmpvar_161;
        tmpvar_21 = tmpvar_162;
      };
      hit_24 = bool(1);
    };
    tmpvar_9 = tmpvar_17;
    tmpvar_10 = tmpvar_18;
    tmpvar_11 = tmpvar_19;
    tmpvar_12 = tmpvar_20;
    tmpvar_13 = tmpvar_21;
    if (hit_24) {
      float vec_y_165;
      vec_y_165 = -(tmpvar_20.z);
      float vec_x_166;
      vec_x_166 = -(tmpvar_20.x);
      float tmpvar_167;
      float tmpvar_168;
      tmpvar_168 = (min (abs(
        (vec_y_165 / vec_x_166)
      ), 1.0) / max (abs(
        (vec_y_165 / vec_x_166)
      ), 1.0));
      float tmpvar_169;
      tmpvar_169 = (tmpvar_168 * tmpvar_168);
      tmpvar_169 = (((
        ((((
          ((((-0.01213232 * tmpvar_169) + 0.05368138) * tmpvar_169) - 0.1173503)
         * tmpvar_169) + 0.1938925) * tmpvar_169) - 0.3326756)
       * tmpvar_169) + 0.9999793) * tmpvar_168);
      tmpvar_169 = (tmpvar_169 + (float(
        (abs((vec_y_165 / vec_x_166)) > 1.0)
      ) * (
        (tmpvar_169 * -2.0)
       + 1.570796)));
      tmpvar_167 = (tmpvar_169 * sign((vec_y_165 / vec_x_166)));
      if ((abs(vec_x_166) > (1e-08 * abs(vec_y_165)))) {
        if ((vec_x_166 < 0.0)) {
          if ((vec_y_165 >= 0.0)) {
            tmpvar_167 += 3.141593;
          } else {
            tmpvar_167 = (tmpvar_167 - 3.141593);
          };
        };
      } else {
        tmpvar_167 = (sign(vec_y_165) * 1.570796);
      };
      u_8 = (0.5 - (tmpvar_167 / 6.283185));
      float x_170;
      x_170 = -(tmpvar_20.y);
      v_7 = (0.5 + ((
        sign(x_170)
       * 
        (1.570796 - (sqrt((1.0 - 
          abs(x_170)
        )) * (1.570796 + (
          abs(x_170)
         * 
          (-0.2146018 + (abs(x_170) * (0.08656672 + (
            abs(x_170)
           * -0.03102955))))
        ))))
      ) / 3.141593));
      if (useNormalMap) {
        if ((tmpvar_17 == 3)) {
          vec3 normalFromMap_171;
          u_8 = (u_8 + (time / 2.0));
          vec2 tmpvar_172;
          tmpvar_172.x = u_8;
          tmpvar_172.y = v_7;
          normalFromMap_171 = normalize(((2.0 * texture2D (earthNormalMap, tmpvar_172).xyz) - 1.0));
          mat3 tmpvar_173;
          float tmpvar_174;
          tmpvar_174 = (1.570796 - (sign(tmpvar_20.z) * (1.570796 - 
            (sqrt((1.0 - abs(tmpvar_20.z))) * (1.570796 + (abs(tmpvar_20.z) * (-0.2146018 + 
              (abs(tmpvar_20.z) * (0.08656672 + (abs(tmpvar_20.z) * -0.03102955)))
            ))))
          )));
          vec3 tmpvar_175;
          tmpvar_175 = ((tmpvar_20.yzx * vec3(1.0, 0.0, 0.0)) - (tmpvar_20.zxy * vec3(0.0, 1.0, 0.0)));
          float tmpvar_176;
          tmpvar_176 = sqrt(dot (tmpvar_175, tmpvar_175));
          if ((tmpvar_176 < 0.001)) {
            tmpvar_173 = mat3(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
          } else {
            vec3 tmpvar_177;
            tmpvar_177 = normalize(tmpvar_175);
            float tmpvar_178;
            tmpvar_178 = sin(tmpvar_174);
            float tmpvar_179;
            tmpvar_179 = cos(tmpvar_174);
            float tmpvar_180;
            tmpvar_180 = (1.0 - tmpvar_179);
            mat3 tmpvar_181;
            tmpvar_181[0].x = (((tmpvar_180 * tmpvar_177.x) * tmpvar_177.x) + tmpvar_179);
            tmpvar_181[0].y = (((tmpvar_180 * tmpvar_177.x) * tmpvar_177.y) - (tmpvar_177.z * tmpvar_178));
            tmpvar_181[0].z = (((tmpvar_180 * tmpvar_177.z) * tmpvar_177.x) + (tmpvar_177.y * tmpvar_178));
            tmpvar_181[1].x = (((tmpvar_180 * tmpvar_177.x) * tmpvar_177.y) + (tmpvar_177.z * tmpvar_178));
            tmpvar_181[1].y = (((tmpvar_180 * tmpvar_177.y) * tmpvar_177.y) + tmpvar_179);
            tmpvar_181[1].z = (((tmpvar_180 * tmpvar_177.y) * tmpvar_177.z) - (tmpvar_177.x * tmpvar_178));
            tmpvar_181[2].x = (((tmpvar_180 * tmpvar_177.z) * tmpvar_177.x) - (tmpvar_177.y * tmpvar_178));
            tmpvar_181[2].y = (((tmpvar_180 * tmpvar_177.y) * tmpvar_177.z) + (tmpvar_177.x * tmpvar_178));
            tmpvar_181[2].z = (((tmpvar_180 * tmpvar_177.z) * tmpvar_177.z) + tmpvar_179);
            tmpvar_173 = tmpvar_181;
          };
          tmpvar_12 = (tmpvar_173 * normalFromMap_171);
        } else {
          if ((tmpvar_17 == 4)) {
            vec3 normalFromMap_182;
            u_8 = (u_8 + (time / 7.0));
            vec2 tmpvar_183;
            tmpvar_183.x = u_8;
            tmpvar_183.y = v_7;
            normalFromMap_182 = normalize(((2.0 * texture2D (moonNormalMap, tmpvar_183).xyz) - 1.0));
            mat3 tmpvar_184;
            float tmpvar_185;
            tmpvar_185 = (1.570796 - (sign(tmpvar_12.z) * (1.570796 - 
              (sqrt((1.0 - abs(tmpvar_12.z))) * (1.570796 + (abs(tmpvar_12.z) * (-0.2146018 + 
                (abs(tmpvar_12.z) * (0.08656672 + (abs(tmpvar_12.z) * -0.03102955)))
              ))))
            )));
            vec3 tmpvar_186;
            tmpvar_186 = ((tmpvar_12.yzx * vec3(1.0, 0.0, 0.0)) - (tmpvar_12.zxy * vec3(0.0, 1.0, 0.0)));
            float tmpvar_187;
            tmpvar_187 = sqrt(dot (tmpvar_186, tmpvar_186));
            if ((tmpvar_187 < 0.001)) {
              tmpvar_184 = mat3(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
            } else {
              vec3 tmpvar_188;
              tmpvar_188 = normalize(tmpvar_186);
              float tmpvar_189;
              tmpvar_189 = sin(tmpvar_185);
              float tmpvar_190;
              tmpvar_190 = cos(tmpvar_185);
              float tmpvar_191;
              tmpvar_191 = (1.0 - tmpvar_190);
              mat3 tmpvar_192;
              tmpvar_192[0].x = (((tmpvar_191 * tmpvar_188.x) * tmpvar_188.x) + tmpvar_190);
              tmpvar_192[0].y = (((tmpvar_191 * tmpvar_188.x) * tmpvar_188.y) - (tmpvar_188.z * tmpvar_189));
              tmpvar_192[0].z = (((tmpvar_191 * tmpvar_188.z) * tmpvar_188.x) + (tmpvar_188.y * tmpvar_189));
              tmpvar_192[1].x = (((tmpvar_191 * tmpvar_188.x) * tmpvar_188.y) + (tmpvar_188.z * tmpvar_189));
              tmpvar_192[1].y = (((tmpvar_191 * tmpvar_188.y) * tmpvar_188.y) + tmpvar_190);
              tmpvar_192[1].z = (((tmpvar_191 * tmpvar_188.y) * tmpvar_188.z) - (tmpvar_188.x * tmpvar_189));
              tmpvar_192[2].x = (((tmpvar_191 * tmpvar_188.z) * tmpvar_188.x) - (tmpvar_188.y * tmpvar_189));
              tmpvar_192[2].y = (((tmpvar_191 * tmpvar_188.y) * tmpvar_188.z) + (tmpvar_188.x * tmpvar_189));
              tmpvar_192[2].z = (((tmpvar_191 * tmpvar_188.z) * tmpvar_188.z) + tmpvar_190);
              tmpvar_184 = tmpvar_192;
            };
            tmpvar_12 = (tmpvar_184 * normalFromMap_182);
          };
        };
      };
      bounceCount_4++;
      vec3 tmpvar_193;
      bool tmpvar_194;
      bool tmpvar_195;
      vec3 tmpvar_196;
      float tmpvar_197;
      Material tmpvar_198;
      if ((tmpvar_17 == 0)) {
        tmpvar_198 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
      } else {
        if ((tmpvar_17 == 1)) {
          tmpvar_198 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_17 == 2)) {
            tmpvar_198 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_17 == 3)) {
              tmpvar_198 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_17 == 4)) {
                tmpvar_198 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if (((tmpvar_17 == 5) || (tmpvar_17 == 6))) {
                  tmpvar_198 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_17 == 7)) {
                    tmpvar_198 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_17 == 8)) {
                      tmpvar_198 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                    } else {
                      if ((tmpvar_17 == 9)) {
                        tmpvar_198 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                      } else {
                        if (((tmpvar_17 >= 10) && (tmpvar_17 < 110))) {
                          tmpvar_198 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                        } else {
                          if (((tmpvar_17 == 110) || (tmpvar_17 == 111))) {
                            tmpvar_198 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                          } else {
                            if (((tmpvar_17 > 111) && (tmpvar_17 < 124))) {
                              tmpvar_198 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                            } else {
                              if ((tmpvar_17 == 124)) {
                                tmpvar_198 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                              } else {
                                if ((tmpvar_17 == 125)) {
                                  tmpvar_198 = Material(vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.4), vec3(0.8, 0.8, 0.8), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_17 > 125)) {
                                    tmpvar_198 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_198 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
      tmpvar_193 = tmpvar_198.amb;
      tmpvar_194 = tmpvar_198.refractive;
      tmpvar_195 = tmpvar_198.reflective;
      tmpvar_196 = tmpvar_198.f0;
      tmpvar_197 = tmpvar_198.n;
      vec3 tmpvar_199;
      if ((tmpvar_17 == 0)) {
        tmpvar_199 = tmpvar_193;
      } else {
        int tmpvar_200;
        vec3 tmpvar_201;
        vec3 tmpvar_202;
        tmpvar_200 = tmpvar_17;
        tmpvar_201 = tmpvar_19;
        tmpvar_202 = tmpvar_12;
        int j_203;
        vec3 specular_204;
        vec3 diffuse_205;
        vec3 color_206;
        vec3 refDir_207;
        vec3 I_208;
        I_208 = (tmpvar_19 - ray_1.origin);
        refDir_207 = normalize((I_208 - (2.0 * 
          (dot (tmpvar_12, I_208) * tmpvar_12)
        )));
        Material tmpvar_209;
        if ((tmpvar_17 == 0)) {
          tmpvar_209 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_17 == 1)) {
            tmpvar_209 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_17 == 2)) {
              tmpvar_209 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_17 == 3)) {
                tmpvar_209 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_17 == 4)) {
                  tmpvar_209 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if (((tmpvar_17 == 5) || (tmpvar_17 == 6))) {
                    tmpvar_209 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_17 == 7)) {
                      tmpvar_209 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_17 == 8)) {
                        tmpvar_209 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                      } else {
                        if ((tmpvar_17 == 9)) {
                          tmpvar_209 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                        } else {
                          if (((tmpvar_17 >= 10) && (tmpvar_17 < 110))) {
                            tmpvar_209 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                          } else {
                            if (((tmpvar_17 == 110) || (tmpvar_17 == 111))) {
                              tmpvar_209 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_17 > 111) && (tmpvar_17 < 124))) {
                                tmpvar_209 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                              } else {
                                if ((tmpvar_17 == 124)) {
                                  tmpvar_209 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_17 == 125)) {
                                    tmpvar_209 = Material(vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.4), vec3(0.8, 0.8, 0.8), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    if ((tmpvar_17 > 125)) {
                                      tmpvar_209 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                    } else {
                                      tmpvar_209 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                    };
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
        color_206 = tmpvar_209.amb;
        diffuse_205 = vec3(0.0, 0.0, 0.0);
        specular_204 = vec3(0.0, 0.0, 0.0);
        j_203 = 0;
        while (true) {
          float diffintensity_210;
          if ((j_203 >= 3)) {
            break;
          };
          vec3 tmpvar_211;
          tmpvar_211 = normalize((lights[j_203].pos - tmpvar_201));
          diffintensity_210 = clamp (dot (tmpvar_202, tmpvar_211), 0.0, 1.0);
          vec3 tmpvar_212;
          Material tmpvar_213;
          if ((tmpvar_200 == 0)) {
            tmpvar_213 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_200 == 1)) {
              tmpvar_213 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_200 == 2)) {
                tmpvar_213 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_200 == 3)) {
                  tmpvar_213 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_200 == 4)) {
                    tmpvar_213 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if (((tmpvar_200 == 5) || (tmpvar_200 == 6))) {
                      tmpvar_213 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_200 == 7)) {
                        tmpvar_213 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_200 == 8)) {
                          tmpvar_213 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_200 == 9)) {
                            tmpvar_213 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_200 >= 10) && (tmpvar_200 < 110))) {
                              tmpvar_213 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_200 == 110) || (tmpvar_200 == 111))) {
                                tmpvar_213 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if (((tmpvar_200 > 111) && (tmpvar_200 < 124))) {
                                  tmpvar_213 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                                } else {
                                  if ((tmpvar_200 == 124)) {
                                    tmpvar_213 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    if ((tmpvar_200 == 125)) {
                                      tmpvar_213 = Material(vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.4), vec3(0.8, 0.8, 0.8), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                    } else {
                                      if ((tmpvar_200 > 125)) {
                                        tmpvar_213 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                      } else {
                                        tmpvar_213 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                      };
                                    };
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
          tmpvar_212 = tmpvar_213.spec;
          float tmpvar_214;
          tmpvar_214 = clamp (dot (tmpvar_211, refDir_207), 0.0, 1.0);
          Material tmpvar_215;
          if ((tmpvar_200 == 0)) {
            tmpvar_215 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_200 == 1)) {
              tmpvar_215 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_200 == 2)) {
                tmpvar_215 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_200 == 3)) {
                  tmpvar_215 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_200 == 4)) {
                    tmpvar_215 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if (((tmpvar_200 == 5) || (tmpvar_200 == 6))) {
                      tmpvar_215 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_200 == 7)) {
                        tmpvar_215 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_200 == 8)) {
                          tmpvar_215 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_200 == 9)) {
                            tmpvar_215 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_200 >= 10) && (tmpvar_200 < 110))) {
                              tmpvar_215 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_200 == 110) || (tmpvar_200 == 111))) {
                                tmpvar_215 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if (((tmpvar_200 > 111) && (tmpvar_200 < 124))) {
                                  tmpvar_215 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                                } else {
                                  if ((tmpvar_200 == 124)) {
                                    tmpvar_215 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    if ((tmpvar_200 == 125)) {
                                      tmpvar_215 = Material(vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.4), vec3(0.8, 0.8, 0.8), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                    } else {
                                      if ((tmpvar_200 > 125)) {
                                        tmpvar_215 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                      } else {
                                        tmpvar_215 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                      };
                                    };
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
          specular_204 = clamp (((tmpvar_212 * lights[j_203].col) * pow (tmpvar_214, tmpvar_215.pow)), 0.0, 1.0);
          Material tmpvar_216;
          if ((tmpvar_200 == 0)) {
            tmpvar_216 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_200 == 1)) {
              tmpvar_216 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_200 == 2)) {
                tmpvar_216 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_200 == 3)) {
                  tmpvar_216 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_200 == 4)) {
                    tmpvar_216 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if (((tmpvar_200 == 5) || (tmpvar_200 == 6))) {
                      tmpvar_216 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_200 == 7)) {
                        tmpvar_216 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_200 == 8)) {
                          tmpvar_216 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_200 == 9)) {
                            tmpvar_216 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_200 >= 10) && (tmpvar_200 < 110))) {
                              tmpvar_216 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_200 == 110) || (tmpvar_200 == 111))) {
                                tmpvar_216 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if (((tmpvar_200 > 111) && (tmpvar_200 < 124))) {
                                  tmpvar_216 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                                } else {
                                  if ((tmpvar_200 == 124)) {
                                    tmpvar_216 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    if ((tmpvar_200 == 125)) {
                                      tmpvar_216 = Material(vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.4), vec3(0.8, 0.8, 0.8), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                    } else {
                                      if ((tmpvar_200 > 125)) {
                                        tmpvar_216 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                      } else {
                                        tmpvar_216 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                      };
                                    };
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
          diffuse_205 = clamp (((tmpvar_216.dif * diffintensity_210) * lights[j_203].col), 0.0, 1.0);
          if (isShadowOn) {
            vec3 tmpvar_217;
            vec3 tmpvar_218;
            tmpvar_217 = (tmpvar_201 + (tmpvar_202 * 0.001));
            tmpvar_218 = normalize((lights[j_203].pos - tmpvar_201));
            int tmpvar_219;
            tmpvar_219 = tmpvar_200;
            int i_220;
            int i_221;
            float minT_222;
            minT_222 = -1.0;
            i_221 = 0;
            while (true) {
              if ((i_221 >= 110)) {
                break;
              };
              vec4 sphere_223;
              sphere_223 = spheres[i_221];
              int tmpvar_224;
              float tmpvar_225;
              bool tmpvar_226;
              float t_227;
              float t2_228;
              float t1_229;
              vec3 tmpvar_230;
              tmpvar_230 = (tmpvar_217 - sphere_223.xyz);
              float tmpvar_231;
              tmpvar_231 = (dot (tmpvar_230, tmpvar_218) * 2.0);
              float tmpvar_232;
              tmpvar_232 = dot (tmpvar_218, tmpvar_218);
              float tmpvar_233;
              tmpvar_233 = ((tmpvar_231 * tmpvar_231) - ((4.0 * tmpvar_232) * (
                dot (tmpvar_230, tmpvar_230)
               - 
                (sphere_223.w * sphere_223.w)
              )));
              if ((tmpvar_233 < 0.0)) {
                tmpvar_226 = bool(0);
              } else {
                float tmpvar_234;
                tmpvar_234 = sqrt(tmpvar_233);
                float tmpvar_235;
                tmpvar_235 = (((
                  -(tmpvar_231)
                 + tmpvar_234) / 2.0) / tmpvar_232);
                t1_229 = tmpvar_235;
                float tmpvar_236;
                tmpvar_236 = (((
                  -(tmpvar_231)
                 - tmpvar_234) / 2.0) / tmpvar_232);
                t2_228 = tmpvar_236;
                if ((tmpvar_235 < 0.001)) {
                  t1_229 = -0.001;
                };
                if ((tmpvar_236 < 0.001)) {
                  t2_228 = -0.001;
                };
                if ((t1_229 < 0.0)) {
                  tmpvar_226 = bool(0);
                } else {
                  if ((t2_228 > 0.0)) {
                    t_227 = t2_228;
                  } else {
                    t_227 = t1_229;
                  };
                  tmpvar_224 = i_221;
                  tmpvar_225 = t_227;
                  tmpvar_226 = bool(1);
                };
              };
              if ((tmpvar_226 && ((tmpvar_225 < minT_222) || (minT_222 < 0.0)))) {
                minT_222 = tmpvar_225;
                tmpvar_219 = tmpvar_224;
              };
              i_221++;
            };
            i_220 = 110;
            while (true) {
              if ((i_220 >= 124)) {
                break;
              };
              Triangle t_237;
              t_237 = triangles[(i_220 - 110)];
              int tmpvar_238;
              float tmpvar_239;
              bool tmpvar_240;
              float t1_241;
              float v_242;
              float u_243;
              float invDet_244;
              vec3 T_245;
              vec3 e2_246;
              vec3 e1_247;
              e1_247 = (t_237.B - t_237.A);
              e2_246 = (t_237.C - t_237.A);
              vec3 tmpvar_248;
              tmpvar_248 = ((tmpvar_218.yzx * e2_246.zxy) - (tmpvar_218.zxy * e2_246.yzx));
              invDet_244 = (1.0/(dot (e1_247, tmpvar_248)));
              T_245 = (tmpvar_217 - t_237.A);
              u_243 = (dot (T_245, tmpvar_248) * invDet_244);
              if (((u_243 < 0.0) || (u_243 > 1.0))) {
                tmpvar_240 = bool(0);
              } else {
                vec3 tmpvar_249;
                tmpvar_249 = ((T_245.yzx * e1_247.zxy) - (T_245.zxy * e1_247.yzx));
                v_242 = (dot (tmpvar_218, tmpvar_249) * invDet_244);
                if (((v_242 < 0.0) || ((u_243 + v_242) > 1.0))) {
                  tmpvar_240 = bool(0);
                } else {
                  t1_241 = (dot (e2_246, tmpvar_249) * invDet_244);
                  if ((t1_241 > 0.001)) {
                    tmpvar_239 = t1_241;
                    tmpvar_238 = i_220;
                    tmpvar_240 = bool(1);
                  } else {
                    tmpvar_240 = bool(0);
                  };
                };
              };
              if ((tmpvar_240 && ((tmpvar_239 < minT_222) || (minT_222 < 0.0)))) {
                minT_222 = tmpvar_239;
                tmpvar_219 = tmpvar_238;
              };
              i_220++;
            };
            vec3 tmpvar_250;
            float tmpvar_251;
            vec3 tmpvar_252;
            tmpvar_250 = ground.o;
            tmpvar_251 = ground.r;
            tmpvar_252 = ground.n;
            bool tmpvar_253;
            tmpvar_253 = bool(1);
            bool tmpvar_254;
            float tmpvar_255;
            bool tmpvar_256;
            float tmpvar_257;
            tmpvar_257 = (dot (tmpvar_252, (tmpvar_250 - tmpvar_217)) / dot (tmpvar_252, tmpvar_218));
            if ((tmpvar_257 < 0.001)) {
              tmpvar_256 = bool(0);
            } else {
              tmpvar_255 = tmpvar_257;
              tmpvar_256 = bool(1);
            };
            if (tmpvar_256) {
              float tmpvar_258;
              vec3 tmpvar_259;
              tmpvar_259 = ((tmpvar_217 + (tmpvar_255 * tmpvar_218)) - tmpvar_250);
              tmpvar_258 = sqrt(dot (tmpvar_259, tmpvar_259));
              if ((tmpvar_258 <= tmpvar_251)) {
                tmpvar_254 = bool(1);
                tmpvar_253 = bool(0);
              };
            };
            if (tmpvar_253) {
              tmpvar_254 = bool(0);
              tmpvar_253 = bool(0);
            };
            if ((tmpvar_254 && ((tmpvar_255 < minT_222) || (minT_222 < 0.0)))) {
              minT_222 = tmpvar_255;
              tmpvar_219 = 124;
            };
            vec3 tmpvar_260;
            tmpvar_260 = skyboxBack.n;
            float tmpvar_261;
            bool tmpvar_262;
            float tmpvar_263;
            tmpvar_263 = (dot (tmpvar_260, (skyboxBack.q - tmpvar_217)) / dot (tmpvar_260, tmpvar_218));
            if ((tmpvar_263 < 0.001)) {
              tmpvar_262 = bool(0);
            } else {
              tmpvar_261 = tmpvar_263;
              tmpvar_262 = bool(1);
            };
            if ((tmpvar_262 && ((tmpvar_261 < minT_222) || (minT_222 < 0.0)))) {
              minT_222 = tmpvar_261;
              tmpvar_219 = 126;
            };
            vec3 tmpvar_264;
            tmpvar_264 = skyboxDown.n;
            float tmpvar_265;
            bool tmpvar_266;
            float tmpvar_267;
            tmpvar_267 = (dot (tmpvar_264, (skyboxDown.q - tmpvar_217)) / dot (tmpvar_264, tmpvar_218));
            if ((tmpvar_267 < 0.001)) {
              tmpvar_266 = bool(0);
            } else {
              tmpvar_265 = tmpvar_267;
              tmpvar_266 = bool(1);
            };
            if ((tmpvar_266 && ((tmpvar_265 < minT_222) || (minT_222 < 0.0)))) {
              minT_222 = tmpvar_265;
              tmpvar_219 = 127;
            };
            vec3 tmpvar_268;
            tmpvar_268 = skyboxFront.n;
            float tmpvar_269;
            bool tmpvar_270;
            float tmpvar_271;
            tmpvar_271 = (dot (tmpvar_268, (skyboxFront.q - tmpvar_217)) / dot (tmpvar_268, tmpvar_218));
            if ((tmpvar_271 < 0.001)) {
              tmpvar_270 = bool(0);
            } else {
              tmpvar_269 = tmpvar_271;
              tmpvar_270 = bool(1);
            };
            if ((tmpvar_270 && ((tmpvar_269 < minT_222) || (minT_222 < 0.0)))) {
              minT_222 = tmpvar_269;
              tmpvar_219 = 128;
            };
            vec3 tmpvar_272;
            tmpvar_272 = skyboxLeft.n;
            float tmpvar_273;
            bool tmpvar_274;
            float tmpvar_275;
            tmpvar_275 = (dot (tmpvar_272, (skyboxLeft.q - tmpvar_217)) / dot (tmpvar_272, tmpvar_218));
            if ((tmpvar_275 < 0.001)) {
              tmpvar_274 = bool(0);
            } else {
              tmpvar_273 = tmpvar_275;
              tmpvar_274 = bool(1);
            };
            if ((tmpvar_274 && ((tmpvar_273 < minT_222) || (minT_222 < 0.0)))) {
              minT_222 = tmpvar_273;
              tmpvar_219 = 129;
            };
            vec3 tmpvar_276;
            tmpvar_276 = skyboxRight.n;
            float tmpvar_277;
            bool tmpvar_278;
            float tmpvar_279;
            tmpvar_279 = (dot (tmpvar_276, (skyboxRight.q - tmpvar_217)) / dot (tmpvar_276, tmpvar_218));
            if ((tmpvar_279 < 0.001)) {
              tmpvar_278 = bool(0);
            } else {
              tmpvar_277 = tmpvar_279;
              tmpvar_278 = bool(1);
            };
            if ((tmpvar_278 && ((tmpvar_277 < minT_222) || (minT_222 < 0.0)))) {
              minT_222 = tmpvar_277;
              tmpvar_219 = 130;
            };
            vec3 tmpvar_280;
            tmpvar_280 = skyboxUp.n;
            float tmpvar_281;
            bool tmpvar_282;
            float tmpvar_283;
            tmpvar_283 = (dot (tmpvar_280, (skyboxUp.q - tmpvar_217)) / dot (tmpvar_280, tmpvar_218));
            if ((tmpvar_283 < 0.001)) {
              tmpvar_282 = bool(0);
            } else {
              tmpvar_281 = tmpvar_283;
              tmpvar_282 = bool(1);
            };
            if ((tmpvar_282 && ((tmpvar_281 < minT_222) || (minT_222 < 0.0)))) {
              minT_222 = tmpvar_281;
              tmpvar_219 = 131;
            };
            if ((((
              (((tmpvar_219 != 0) && (tmpvar_219 != 5)) && (tmpvar_219 != 6))
             && 
              (tmpvar_219 != 124)
            ) && (tmpvar_219 != tmpvar_200)) && (tmpvar_200 <= 124))) {
              specular_204 = vec3(0.0, 0.0, 0.0);
              diffuse_205 = vec3(0.0, 0.0, 0.0);
            };
          };
          color_206 = (color_206 + (diffuse_205 + specular_204));
          j_203++;
        };
        tmpvar_199 = color_206;
      };
      color_14 = (color_14 + (tmpvar_199 * coeff_3));
      if ((tmpvar_17 == 0)) {
        float tmpvar_284;
        tmpvar_284 = (time / 5.0);
        u_8 = (u_8 + tmpvar_284);
        v_7 = (v_7 + tmpvar_284);
        vec2 tmpvar_285;
        tmpvar_285.x = u_8;
        tmpvar_285.y = v_7;
        color_14 = (color_14 * (texture2D (sunTexture, tmpvar_285).xyz + vec3(0.0, 0.0, 0.5)));
      } else {
        if ((tmpvar_17 == 3)) {
          if (!(useNormalMap)) {
            u_8 = (u_8 + (time / 2.0));
          };
          vec2 tmpvar_286;
          tmpvar_286.x = u_8;
          tmpvar_286.y = v_7;
          color_14 = (color_14 * texture2D (earthTexture, tmpvar_286).xyz);
        } else {
          if ((tmpvar_17 == 4)) {
            if (!(useNormalMap)) {
              u_8 = (u_8 + (time / 7.0));
            };
            vec2 tmpvar_287;
            tmpvar_287.x = u_8;
            tmpvar_287.y = v_7;
            color_14 = (color_14 * texture2D (moonTexture, tmpvar_287).xyz);
          } else {
            if ((tmpvar_17 == 124)) {
              color_14 = (color_14 * texture2D (groundTexture, (0.15 * tmpvar_19.xz)).xyz);
            } else {
              if ((tmpvar_17 == 126)) {
                color_14 = (color_14 * texture2D (skyboxTextureBack, ((
                  -(tmpvar_19.xy)
                 + vec2(
                  (skyboxRatio / 2.0)
                )) / skyboxRatio)).xyz);
              } else {
                if ((tmpvar_17 == 127)) {
                  color_14 = (color_14 * texture2D (skyboxTextureDown, ((tmpvar_19.xz + vec2(
                    (skyboxRatio / 2.0)
                  )) / skyboxRatio)).xyz);
                } else {
                  if ((tmpvar_17 == 128)) {
                    color_14 = (color_14 * texture2D (skyboxTextureFront, ((
                      (tmpvar_19.xy * vec2(1.0, -1.0))
                     + vec2(
                      (skyboxRatio / 2.0)
                    )) / skyboxRatio)).xyz);
                  } else {
                    if ((tmpvar_17 == 129)) {
                      color_14 = (color_14 * texture2D (skyboxTextureLeft, ((tmpvar_19.yz + vec2(
                        (skyboxRatio / 2.0)
                      )) / skyboxRatio)).xyz);
                    } else {
                      if ((tmpvar_17 == 130)) {
                        color_14 = (color_14 * texture2D (skyboxTextureRight, ((
                          (tmpvar_19.zy * vec2(1.0, -1.0))
                         + vec2(
                          (skyboxRatio / 2.0)
                        )) / skyboxRatio)).xyz);
                      } else {
                        if ((tmpvar_17 == 131)) {
                          color_14 = (color_14 * texture2D (skyboxTextureUp, ((tmpvar_19.xz + vec2(
                            (skyboxRatio / 2.0)
                          )) / skyboxRatio)).xyz);
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
      bool tmpvar_288;
      tmpvar_288 = (((tmpvar_17 == 3) && (color_14.z > color_14.x)) && (color_14.z > color_14.y));
      if ((((tmpvar_195 || tmpvar_194) || tmpvar_288) && (bounceCount_4 <= depth))) {
        bool totalInternalReflection_289;
        totalInternalReflection_289 = bool(0);
        if (tmpvar_194) {
          Ray refractedRay_290;
          float tmpvar_291;
          tmpvar_291 = (1.0/(tmpvar_197));
          float tmpvar_292;
          tmpvar_292 = dot (ray_1.dir, tmpvar_12);
          vec3 tmpvar_293;
          if ((tmpvar_292 <= 0.0)) {
            vec3 I_294;
            I_294 = ray_1.dir;
            vec3 tmpvar_295;
            float tmpvar_296;
            tmpvar_296 = dot (tmpvar_12, I_294);
            float tmpvar_297;
            tmpvar_297 = (1.0 - (tmpvar_291 * (tmpvar_291 * 
              (1.0 - (tmpvar_296 * tmpvar_296))
            )));
            if ((tmpvar_297 < 0.0)) {
              tmpvar_295 = vec3(0.0, 0.0, 0.0);
            } else {
              tmpvar_295 = ((tmpvar_291 * I_294) - ((
                (tmpvar_291 * tmpvar_296)
               + 
                sqrt(tmpvar_297)
              ) * tmpvar_12));
            };
            tmpvar_293 = tmpvar_295;
          } else {
            vec3 I_298;
            I_298 = ray_1.dir;
            vec3 N_299;
            N_299 = -(tmpvar_12);
            float eta_300;
            eta_300 = (1.0/(tmpvar_291));
            vec3 tmpvar_301;
            float tmpvar_302;
            tmpvar_302 = dot (N_299, I_298);
            float tmpvar_303;
            tmpvar_303 = (1.0 - (eta_300 * (eta_300 * 
              (1.0 - (tmpvar_302 * tmpvar_302))
            )));
            if ((tmpvar_303 < 0.0)) {
              tmpvar_301 = vec3(0.0, 0.0, 0.0);
            } else {
              tmpvar_301 = ((eta_300 * I_298) - ((
                (eta_300 * tmpvar_302)
               + 
                sqrt(tmpvar_303)
              ) * N_299));
            };
            tmpvar_293 = tmpvar_301;
          };
          refractedRay_290.dir = tmpvar_293;
          vec3 x_304;
          x_304 = refractedRay_290.dir;
          totalInternalReflection_289 = (sqrt(dot (x_304, x_304)) < 0.001);
          if (totalInternalReflection_289) {
            vec3 I_305;
            I_305 = ray_1.dir;
            vec3 N_306;
            N_306 = -(tmpvar_12);
            ray_1.dir = normalize((I_305 - (2.0 * 
              (dot (N_306, I_305) * N_306)
            )));
            ray_1.origin = (tmpvar_19 - (tmpvar_12 * 0.001));
          } else {
            refractedRay_290.origin = (tmpvar_19 + ((tmpvar_12 * 0.001) * sign(
              dot (ray_1.dir, tmpvar_12)
            )));
            refractedRay_290.dir = normalize(refractedRay_290.dir);
            if (!(tmpvar_195)) {
              ray_1 = refractedRay_290;
            } else {
              stack_6[stackSize_5].coeff = (coeff_3 * (vec3(1.0, 1.0, 1.0) - (tmpvar_196 + 
                ((vec3(1.0, 1.0, 1.0) - tmpvar_196) * pow ((1.0 - abs(
                  dot (tmpvar_12, refractedRay_290.dir)
                )), 5.0))
              )));
              stack_6[stackSize_5].depth = bounceCount_4;
              int tmpvar_307;
              tmpvar_307 = stackSize_5;
              stackSize_5++;
              stack_6[tmpvar_307].ray = refractedRay_290;
            };
          };
        };
        if ((((tmpvar_195 && 
          !(totalInternalReflection_289)
        ) && (tmpvar_17 != 3)) || tmpvar_288)) {
          float tmpvar_308;
          tmpvar_308 = dot (ray_1.dir, tmpvar_12);
          if ((tmpvar_308 < 0.0)) {
            coeff_3 = (coeff_3 * (tmpvar_196 + (
              (vec3(1.0, 1.0, 1.0) - tmpvar_196)
             * 
              pow ((1.0 - abs(dot (tmpvar_12, ray_1.dir))), 5.0)
            )));
            vec3 I_309;
            I_309 = ray_1.dir;
            ray_1.dir = normalize((I_309 - (2.0 * 
              (dot (tmpvar_12, I_309) * tmpvar_12)
            )));
            ray_1.origin = (tmpvar_19 + (tmpvar_12 * 0.001));
          } else {
            continueLoop_2 = bool(0);
          };
        };
      } else {
        continueLoop_2 = bool(0);
      };
    } else {
      color_14 = (color_14 + (vec3(0.6, 0.75, 0.9) * coeff_3));
      continueLoop_2 = bool(0);
    };
    if (isGlowOn) {
      vec3 glowness_310;
      vec3 tmpvar_311;
      tmpvar_311 = normalize(ray_1.dir);
      vec3 tmpvar_312;
      tmpvar_312 = (ray_1.origin + (abs(
        dot ((spheres[0].xyz - ray_1.origin), tmpvar_311)
      ) * tmpvar_311));
      float tmpvar_313;
      tmpvar_313 = sqrt(dot (tmpvar_312, tmpvar_312));
      float tmpvar_314;
      vec3 x_315;
      x_315 = (tmpvar_19 - eye);
      tmpvar_314 = sqrt(dot (x_315, x_315));
      float tmpvar_316;
      vec3 x_317;
      x_317 = (spheres[0].xyz - eye);
      tmpvar_316 = sqrt(dot (x_317, x_317));
      if (((tmpvar_314 + spheres[0].w) < tmpvar_316)) {
        glowness_310 = vec3(0.0, 0.0, 0.0);
      } else {
        glowness_310 = (vec3(1.0, 0.95, 0.1) * clamp ((2.0 / 
          (0.5 + (tmpvar_313 * tmpvar_313))
        ), 0.0, 1.0));
      };
      color_14 = (color_14 + glowness_310);
    };
    if ((!(continueLoop_2) && (stackSize_5 > 0))) {
      int tmpvar_318;
      tmpvar_318 = (stackSize_5 - 1);
      stackSize_5 = tmpvar_318;
      ray_1 = stack_6[tmpvar_318].ray;
      bounceCount_4 = stack_6[tmpvar_318].depth;
      coeff_3 = stack_6[tmpvar_318].coeff;
      continueLoop_2 = bool(1);
    };
  };
  vec4 tmpvar_319;
  tmpvar_319.w = 1.0;
  tmpvar_319.x = color_14[colorModeInTernary[0]];
  tmpvar_319.y = color_14[colorModeInTernary[1]];
  tmpvar_319.z = color_14[colorModeInTernary[2]];
  gl_FragColor = tmpvar_319;
}