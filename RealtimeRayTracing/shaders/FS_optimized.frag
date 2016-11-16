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
    float tmpvar_70;
    vec3 tmpvar_71;
    vec3 tmpvar_72;
    vec3 tmpvar_73;
    bool tmpvar_74;
    float tmpvar_75;
    tmpvar_75 = (dot (tmpvar_68, (tmpvar_66 - tmpvar_15)) / dot (tmpvar_68, tmpvar_16));
    if ((tmpvar_75 < 0.001)) {
      tmpvar_74 = bool(0);
    } else {
      tmpvar_70 = tmpvar_75;
      tmpvar_73 = tmpvar_66;
      tmpvar_71 = (tmpvar_15 + (tmpvar_75 * tmpvar_16));
      tmpvar_72 = tmpvar_68;
      tmpvar_74 = bool(1);
    };
    if (tmpvar_74) {
      vec3 tmpvar_76;
      tmpvar_76 = ((tmpvar_15 + (tmpvar_70 * tmpvar_16)) - tmpvar_66);
      float tmpvar_77;
      tmpvar_77 = sqrt(dot (tmpvar_76, tmpvar_76));
      if ((tmpvar_77 > tmpvar_67)) {
        tmpvar_69 = bool(0);
      } else {
        tmpvar_69 = bool(1);
      };
    } else {
      tmpvar_69 = bool(0);
    };
    tmpvar_26 = 124;
    tmpvar_27 = tmpvar_70;
    tmpvar_28 = tmpvar_71;
    tmpvar_29 = tmpvar_72;
    tmpvar_30 = tmpvar_73;
    if (tmpvar_69) {
      if (((tmpvar_70 < minT_25) || (minT_25 < 0.0))) {
        minT_25 = tmpvar_70;
        tmpvar_17 = 124;
        tmpvar_18 = tmpvar_70;
        tmpvar_19 = tmpvar_71;
        tmpvar_20 = tmpvar_72;
        tmpvar_21 = tmpvar_73;
      };
      hit_24 = bool(1);
    };
    bool tmpvar_78;
    if ((bounceCount_4 > 1)) {
      vec3 tmpvar_79;
      tmpvar_79.yz = tmpvar_15.yz;
      float tmpvar_80;
      vec3 tmpvar_81;
      vec3 tmpvar_82;
      vec3 tmpvar_83;
      bool tmpvar_84;
      tmpvar_84 = bool(1);
      bool tmpvar_85;
      float result_86;
      float d2_87;
      float d1_88;
      float z_89;
      float h_90;
      float r_91;
      float p_92;
      tmpvar_79.x = (tmpvar_15.x - 10.0);
      float tmpvar_93;
      tmpvar_93 = (torus.x * torus.x);
      float tmpvar_94;
      tmpvar_94 = (torus.y * torus.y);
      float tmpvar_95;
      tmpvar_95 = dot (tmpvar_79, tmpvar_16);
      float tmpvar_96;
      tmpvar_96 = (((
        dot (tmpvar_79, tmpvar_79)
       - tmpvar_94) - tmpvar_93) / 2.0);
      float tmpvar_97;
      tmpvar_97 = (((tmpvar_95 * tmpvar_95) + (
        (tmpvar_93 * tmpvar_16.z)
       * tmpvar_16.z)) + tmpvar_96);
      float tmpvar_98;
      tmpvar_98 = ((tmpvar_96 * tmpvar_95) + ((tmpvar_93 * tmpvar_15.z) * tmpvar_16.z));
      float tmpvar_99;
      tmpvar_99 = (((
        (2.0 * tmpvar_95)
       * 
        (tmpvar_95 * tmpvar_95)
      ) - (
        (2.0 * tmpvar_95)
       * tmpvar_97)) + (2.0 * tmpvar_98));
      p_92 = (((
        (-3.0 * tmpvar_95)
       * tmpvar_95) + (2.0 * tmpvar_97)) / 3.0);
      r_91 = (((
        (((-3.0 * tmpvar_95) * ((tmpvar_95 * tmpvar_95) * tmpvar_95)) + ((4.0 * tmpvar_95) * (tmpvar_95 * tmpvar_97)))
       - 
        ((8.0 * tmpvar_95) * tmpvar_98)
      ) + (4.0 * 
        (((tmpvar_96 * tmpvar_96) + ((tmpvar_93 * tmpvar_15.z) * tmpvar_15.z)) - (tmpvar_93 * tmpvar_94))
      )) / 3.0);
      float tmpvar_100;
      tmpvar_100 = ((p_92 * p_92) + r_91);
      float tmpvar_101;
      tmpvar_101 = (((
        (3.0 * r_91)
       * p_92) - (
        (p_92 * p_92)
       * p_92)) - (tmpvar_99 * tmpvar_99));
      float tmpvar_102;
      tmpvar_102 = ((tmpvar_101 * tmpvar_101) - ((tmpvar_100 * tmpvar_100) * tmpvar_100));
      h_90 = tmpvar_102;
      z_89 = 0.0;
      if ((tmpvar_102 < 0.0)) {
        float tmpvar_103;
        tmpvar_103 = sqrt(tmpvar_100);
        float x_104;
        x_104 = (tmpvar_101 / (tmpvar_103 * tmpvar_100));
        z_89 = ((2.0 * tmpvar_103) * cos((
          (1.570796 - (sign(x_104) * (1.570796 - (
            sqrt((1.0 - abs(x_104)))
           * 
            (1.570796 + (abs(x_104) * (-0.2146018 + (
              abs(x_104)
             * 
              (0.08656672 + (abs(x_104) * -0.03102955))
            ))))
          ))))
         / 3.0)));
      } else {
        float tmpvar_105;
        tmpvar_105 = pow ((sqrt(tmpvar_102) + abs(tmpvar_101)), 0.3333333);
        z_89 = (sign(tmpvar_101) * abs((tmpvar_105 + 
          (tmpvar_100 / tmpvar_105)
        )));
      };
      z_89 = (p_92 - z_89);
      float tmpvar_106;
      tmpvar_106 = (z_89 - (3.0 * p_92));
      d1_88 = tmpvar_106;
      float tmpvar_107;
      tmpvar_107 = ((z_89 * z_89) - (3.0 * r_91));
      d2_87 = tmpvar_107;
      float tmpvar_108;
      tmpvar_108 = abs(tmpvar_106);
      if ((tmpvar_108 < 0.001)) {
        if ((tmpvar_107 < 0.0)) {
          tmpvar_85 = bool(0);
          tmpvar_84 = bool(0);
        } else {
          d2_87 = sqrt(tmpvar_107);
        };
      } else {
        if ((tmpvar_106 < 0.0)) {
          tmpvar_85 = bool(0);
          tmpvar_84 = bool(0);
        } else {
          float tmpvar_109;
          tmpvar_109 = sqrt((tmpvar_106 / 2.0));
          d1_88 = tmpvar_109;
          d2_87 = (tmpvar_99 / tmpvar_109);
        };
      };
      if (tmpvar_84) {
        result_86 = 1e+20;
        h_90 = (((d1_88 * d1_88) - z_89) + d2_87);
        if ((h_90 > 0.0)) {
          float tmpvar_110;
          tmpvar_110 = sqrt(h_90);
          h_90 = tmpvar_110;
          float tmpvar_111;
          tmpvar_111 = ((-(d1_88) - tmpvar_110) - tmpvar_95);
          float tmpvar_112;
          tmpvar_112 = ((-(d1_88) + tmpvar_110) - tmpvar_95);
          if ((tmpvar_111 > 0.0)) {
            result_86 = tmpvar_111;
          } else {
            if ((tmpvar_112 > 0.0)) {
              result_86 = tmpvar_112;
            };
          };
        };
        h_90 = (((d1_88 * d1_88) - z_89) - d2_87);
        if ((h_90 > 0.0)) {
          float tmpvar_113;
          tmpvar_113 = sqrt(h_90);
          h_90 = tmpvar_113;
          float tmpvar_114;
          tmpvar_114 = ((d1_88 - tmpvar_113) - tmpvar_95);
          float tmpvar_115;
          tmpvar_115 = ((d1_88 + tmpvar_113) - tmpvar_95);
          if ((tmpvar_114 > 0.0)) {
            result_86 = min (result_86, tmpvar_114);
          } else {
            if ((tmpvar_115 > 0.0)) {
              result_86 = min (result_86, tmpvar_115);
            };
          };
        };
        if (((result_86 > 0.0) && (result_86 < 1000.0))) {
          tmpvar_80 = result_86;
          tmpvar_81 = (tmpvar_79 + (result_86 * tmpvar_16));
          tmpvar_82 = normalize((tmpvar_81 * (
            (dot (tmpvar_81, tmpvar_81) - (torus.y * torus.y))
           - 
            ((torus.x * torus.x) * vec3(1.0, 1.0, -1.0))
          )));
          tmpvar_85 = bool(1);
          tmpvar_84 = bool(0);
        } else {
          tmpvar_85 = bool(0);
          tmpvar_84 = bool(0);
        };
      };
      tmpvar_26 = 125;
      tmpvar_27 = tmpvar_80;
      tmpvar_28 = tmpvar_81;
      tmpvar_29 = tmpvar_82;
      tmpvar_30 = tmpvar_83;
      tmpvar_78 = tmpvar_85;
    } else {
      tmpvar_78 = bool(0);
    };
    if (tmpvar_78) {
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
    vec3 tmpvar_116;
    vec3 tmpvar_117;
    tmpvar_116 = skyboxBack.n;
    tmpvar_117 = skyboxBack.q;
    float tmpvar_118;
    vec3 tmpvar_119;
    vec3 tmpvar_120;
    vec3 tmpvar_121;
    bool tmpvar_122;
    float tmpvar_123;
    tmpvar_123 = (dot (tmpvar_116, (tmpvar_117 - tmpvar_15)) / dot (tmpvar_116, tmpvar_16));
    if ((tmpvar_123 < 0.001)) {
      tmpvar_122 = bool(0);
    } else {
      tmpvar_118 = tmpvar_123;
      tmpvar_121 = tmpvar_117;
      tmpvar_119 = (tmpvar_15 + (tmpvar_123 * tmpvar_16));
      tmpvar_120 = tmpvar_116;
      tmpvar_122 = bool(1);
    };
    tmpvar_26 = 126;
    tmpvar_27 = tmpvar_118;
    tmpvar_28 = tmpvar_119;
    tmpvar_29 = tmpvar_120;
    tmpvar_30 = tmpvar_121;
    if (tmpvar_122) {
      if (((tmpvar_118 < minT_25) || (minT_25 < 0.0))) {
        minT_25 = tmpvar_118;
        tmpvar_17 = 126;
        tmpvar_18 = tmpvar_118;
        tmpvar_19 = tmpvar_119;
        tmpvar_20 = tmpvar_120;
        tmpvar_21 = tmpvar_121;
      };
      hit_24 = bool(1);
    };
    vec3 tmpvar_124;
    vec3 tmpvar_125;
    tmpvar_124 = skyboxDown.n;
    tmpvar_125 = skyboxDown.q;
    float tmpvar_126;
    vec3 tmpvar_127;
    vec3 tmpvar_128;
    vec3 tmpvar_129;
    bool tmpvar_130;
    float tmpvar_131;
    tmpvar_131 = (dot (tmpvar_124, (tmpvar_125 - tmpvar_15)) / dot (tmpvar_124, tmpvar_16));
    if ((tmpvar_131 < 0.001)) {
      tmpvar_130 = bool(0);
    } else {
      tmpvar_126 = tmpvar_131;
      tmpvar_129 = tmpvar_125;
      tmpvar_127 = (tmpvar_15 + (tmpvar_131 * tmpvar_16));
      tmpvar_128 = tmpvar_124;
      tmpvar_130 = bool(1);
    };
    tmpvar_26 = 127;
    tmpvar_27 = tmpvar_126;
    tmpvar_28 = tmpvar_127;
    tmpvar_29 = tmpvar_128;
    tmpvar_30 = tmpvar_129;
    if (tmpvar_130) {
      if (((tmpvar_126 < minT_25) || (minT_25 < 0.0))) {
        minT_25 = tmpvar_126;
        tmpvar_17 = 127;
        tmpvar_18 = tmpvar_126;
        tmpvar_19 = tmpvar_127;
        tmpvar_20 = tmpvar_128;
        tmpvar_21 = tmpvar_129;
      };
      hit_24 = bool(1);
    };
    vec3 tmpvar_132;
    vec3 tmpvar_133;
    tmpvar_132 = skyboxFront.n;
    tmpvar_133 = skyboxFront.q;
    float tmpvar_134;
    vec3 tmpvar_135;
    vec3 tmpvar_136;
    vec3 tmpvar_137;
    bool tmpvar_138;
    float tmpvar_139;
    tmpvar_139 = (dot (tmpvar_132, (tmpvar_133 - tmpvar_15)) / dot (tmpvar_132, tmpvar_16));
    if ((tmpvar_139 < 0.001)) {
      tmpvar_138 = bool(0);
    } else {
      tmpvar_134 = tmpvar_139;
      tmpvar_137 = tmpvar_133;
      tmpvar_135 = (tmpvar_15 + (tmpvar_139 * tmpvar_16));
      tmpvar_136 = tmpvar_132;
      tmpvar_138 = bool(1);
    };
    tmpvar_26 = 128;
    tmpvar_27 = tmpvar_134;
    tmpvar_28 = tmpvar_135;
    tmpvar_29 = tmpvar_136;
    tmpvar_30 = tmpvar_137;
    if (tmpvar_138) {
      if (((tmpvar_134 < minT_25) || (minT_25 < 0.0))) {
        minT_25 = tmpvar_134;
        tmpvar_17 = 128;
        tmpvar_18 = tmpvar_134;
        tmpvar_19 = tmpvar_135;
        tmpvar_20 = tmpvar_136;
        tmpvar_21 = tmpvar_137;
      };
      hit_24 = bool(1);
    };
    vec3 tmpvar_140;
    vec3 tmpvar_141;
    tmpvar_140 = skyboxLeft.n;
    tmpvar_141 = skyboxLeft.q;
    float tmpvar_142;
    vec3 tmpvar_143;
    vec3 tmpvar_144;
    vec3 tmpvar_145;
    bool tmpvar_146;
    float tmpvar_147;
    tmpvar_147 = (dot (tmpvar_140, (tmpvar_141 - tmpvar_15)) / dot (tmpvar_140, tmpvar_16));
    if ((tmpvar_147 < 0.001)) {
      tmpvar_146 = bool(0);
    } else {
      tmpvar_142 = tmpvar_147;
      tmpvar_145 = tmpvar_141;
      tmpvar_143 = (tmpvar_15 + (tmpvar_147 * tmpvar_16));
      tmpvar_144 = tmpvar_140;
      tmpvar_146 = bool(1);
    };
    tmpvar_26 = 129;
    tmpvar_27 = tmpvar_142;
    tmpvar_28 = tmpvar_143;
    tmpvar_29 = tmpvar_144;
    tmpvar_30 = tmpvar_145;
    if (tmpvar_146) {
      if (((tmpvar_142 < minT_25) || (minT_25 < 0.0))) {
        minT_25 = tmpvar_142;
        tmpvar_17 = 129;
        tmpvar_18 = tmpvar_142;
        tmpvar_19 = tmpvar_143;
        tmpvar_20 = tmpvar_144;
        tmpvar_21 = tmpvar_145;
      };
      hit_24 = bool(1);
    };
    vec3 tmpvar_148;
    vec3 tmpvar_149;
    tmpvar_148 = skyboxRight.n;
    tmpvar_149 = skyboxRight.q;
    float tmpvar_150;
    vec3 tmpvar_151;
    vec3 tmpvar_152;
    vec3 tmpvar_153;
    bool tmpvar_154;
    float tmpvar_155;
    tmpvar_155 = (dot (tmpvar_148, (tmpvar_149 - tmpvar_15)) / dot (tmpvar_148, tmpvar_16));
    if ((tmpvar_155 < 0.001)) {
      tmpvar_154 = bool(0);
    } else {
      tmpvar_150 = tmpvar_155;
      tmpvar_153 = tmpvar_149;
      tmpvar_151 = (tmpvar_15 + (tmpvar_155 * tmpvar_16));
      tmpvar_152 = tmpvar_148;
      tmpvar_154 = bool(1);
    };
    tmpvar_26 = 130;
    tmpvar_27 = tmpvar_150;
    tmpvar_28 = tmpvar_151;
    tmpvar_29 = tmpvar_152;
    tmpvar_30 = tmpvar_153;
    if (tmpvar_154) {
      if (((tmpvar_150 < minT_25) || (minT_25 < 0.0))) {
        minT_25 = tmpvar_150;
        tmpvar_17 = 130;
        tmpvar_18 = tmpvar_150;
        tmpvar_19 = tmpvar_151;
        tmpvar_20 = tmpvar_152;
        tmpvar_21 = tmpvar_153;
      };
      hit_24 = bool(1);
    };
    vec3 tmpvar_156;
    vec3 tmpvar_157;
    tmpvar_156 = skyboxUp.n;
    tmpvar_157 = skyboxUp.q;
    float tmpvar_158;
    vec3 tmpvar_159;
    vec3 tmpvar_160;
    vec3 tmpvar_161;
    bool tmpvar_162;
    float tmpvar_163;
    tmpvar_163 = (dot (tmpvar_156, (tmpvar_157 - tmpvar_15)) / dot (tmpvar_156, tmpvar_16));
    if ((tmpvar_163 < 0.001)) {
      tmpvar_162 = bool(0);
    } else {
      tmpvar_158 = tmpvar_163;
      tmpvar_161 = tmpvar_157;
      tmpvar_159 = (tmpvar_15 + (tmpvar_163 * tmpvar_16));
      tmpvar_160 = tmpvar_156;
      tmpvar_162 = bool(1);
    };
    tmpvar_26 = 131;
    tmpvar_27 = tmpvar_158;
    tmpvar_28 = tmpvar_159;
    tmpvar_29 = tmpvar_160;
    tmpvar_30 = tmpvar_161;
    if (tmpvar_162) {
      if (((tmpvar_158 < minT_25) || (minT_25 < 0.0))) {
        minT_25 = tmpvar_158;
        tmpvar_17 = 131;
        tmpvar_18 = tmpvar_158;
        tmpvar_19 = tmpvar_159;
        tmpvar_20 = tmpvar_160;
        tmpvar_21 = tmpvar_161;
      };
      hit_24 = bool(1);
    };
    tmpvar_9 = tmpvar_17;
    tmpvar_10 = tmpvar_18;
    tmpvar_11 = tmpvar_19;
    tmpvar_12 = tmpvar_20;
    tmpvar_13 = tmpvar_21;
    if (hit_24) {
      float vec_y_164;
      vec_y_164 = -(tmpvar_20.z);
      float vec_x_165;
      vec_x_165 = -(tmpvar_20.x);
      float tmpvar_166;
      float tmpvar_167;
      tmpvar_167 = (min (abs(
        (vec_y_164 / vec_x_165)
      ), 1.0) / max (abs(
        (vec_y_164 / vec_x_165)
      ), 1.0));
      float tmpvar_168;
      tmpvar_168 = (tmpvar_167 * tmpvar_167);
      tmpvar_168 = (((
        ((((
          ((((-0.01213232 * tmpvar_168) + 0.05368138) * tmpvar_168) - 0.1173503)
         * tmpvar_168) + 0.1938925) * tmpvar_168) - 0.3326756)
       * tmpvar_168) + 0.9999793) * tmpvar_167);
      tmpvar_168 = (tmpvar_168 + (float(
        (abs((vec_y_164 / vec_x_165)) > 1.0)
      ) * (
        (tmpvar_168 * -2.0)
       + 1.570796)));
      tmpvar_166 = (tmpvar_168 * sign((vec_y_164 / vec_x_165)));
      if ((abs(vec_x_165) > (1e-08 * abs(vec_y_164)))) {
        if ((vec_x_165 < 0.0)) {
          if ((vec_y_164 >= 0.0)) {
            tmpvar_166 += 3.141593;
          } else {
            tmpvar_166 = (tmpvar_166 - 3.141593);
          };
        };
      } else {
        tmpvar_166 = (sign(vec_y_164) * 1.570796);
      };
      u_8 = (0.5 - (tmpvar_166 / 6.283185));
      float x_169;
      x_169 = -(tmpvar_20.y);
      v_7 = (0.5 + ((
        sign(x_169)
       * 
        (1.570796 - (sqrt((1.0 - 
          abs(x_169)
        )) * (1.570796 + (
          abs(x_169)
         * 
          (-0.2146018 + (abs(x_169) * (0.08656672 + (
            abs(x_169)
           * -0.03102955))))
        ))))
      ) / 3.141593));
      if (useNormalMap) {
        if ((tmpvar_17 == 3)) {
          vec3 normalFromMap_170;
          u_8 = (u_8 + (time / 2.0));
          vec2 tmpvar_171;
          tmpvar_171.x = u_8;
          tmpvar_171.y = v_7;
          normalFromMap_170 = normalize(((2.0 * texture2D (earthNormalMap, tmpvar_171).xyz) - 1.0));
          mat3 tmpvar_172;
          float tmpvar_173;
          tmpvar_173 = (1.570796 - (sign(tmpvar_20.z) * (1.570796 - 
            (sqrt((1.0 - abs(tmpvar_20.z))) * (1.570796 + (abs(tmpvar_20.z) * (-0.2146018 + 
              (abs(tmpvar_20.z) * (0.08656672 + (abs(tmpvar_20.z) * -0.03102955)))
            ))))
          )));
          vec3 tmpvar_174;
          tmpvar_174 = ((tmpvar_20.yzx * vec3(1.0, 0.0, 0.0)) - (tmpvar_20.zxy * vec3(0.0, 1.0, 0.0)));
          float tmpvar_175;
          tmpvar_175 = sqrt(dot (tmpvar_174, tmpvar_174));
          if ((tmpvar_175 < 0.001)) {
            tmpvar_172 = mat3(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
          } else {
            vec3 tmpvar_176;
            tmpvar_176 = normalize(tmpvar_174);
            float tmpvar_177;
            tmpvar_177 = sin(tmpvar_173);
            float tmpvar_178;
            tmpvar_178 = cos(tmpvar_173);
            float tmpvar_179;
            tmpvar_179 = (1.0 - tmpvar_178);
            mat3 tmpvar_180;
            tmpvar_180[0].x = (((tmpvar_179 * tmpvar_176.x) * tmpvar_176.x) + tmpvar_178);
            tmpvar_180[0].y = (((tmpvar_179 * tmpvar_176.x) * tmpvar_176.y) - (tmpvar_176.z * tmpvar_177));
            tmpvar_180[0].z = (((tmpvar_179 * tmpvar_176.z) * tmpvar_176.x) + (tmpvar_176.y * tmpvar_177));
            tmpvar_180[1].x = (((tmpvar_179 * tmpvar_176.x) * tmpvar_176.y) + (tmpvar_176.z * tmpvar_177));
            tmpvar_180[1].y = (((tmpvar_179 * tmpvar_176.y) * tmpvar_176.y) + tmpvar_178);
            tmpvar_180[1].z = (((tmpvar_179 * tmpvar_176.y) * tmpvar_176.z) - (tmpvar_176.x * tmpvar_177));
            tmpvar_180[2].x = (((tmpvar_179 * tmpvar_176.z) * tmpvar_176.x) - (tmpvar_176.y * tmpvar_177));
            tmpvar_180[2].y = (((tmpvar_179 * tmpvar_176.y) * tmpvar_176.z) + (tmpvar_176.x * tmpvar_177));
            tmpvar_180[2].z = (((tmpvar_179 * tmpvar_176.z) * tmpvar_176.z) + tmpvar_178);
            tmpvar_172 = tmpvar_180;
          };
          tmpvar_12 = (tmpvar_172 * normalFromMap_170);
        } else {
          if ((tmpvar_17 == 4)) {
            vec3 normalFromMap_181;
            u_8 = (u_8 + (time / 7.0));
            vec2 tmpvar_182;
            tmpvar_182.x = u_8;
            tmpvar_182.y = v_7;
            normalFromMap_181 = normalize(((2.0 * texture2D (moonNormalMap, tmpvar_182).xyz) - 1.0));
            mat3 tmpvar_183;
            float tmpvar_184;
            tmpvar_184 = (1.570796 - (sign(tmpvar_12.z) * (1.570796 - 
              (sqrt((1.0 - abs(tmpvar_12.z))) * (1.570796 + (abs(tmpvar_12.z) * (-0.2146018 + 
                (abs(tmpvar_12.z) * (0.08656672 + (abs(tmpvar_12.z) * -0.03102955)))
              ))))
            )));
            vec3 tmpvar_185;
            tmpvar_185 = ((tmpvar_12.yzx * vec3(1.0, 0.0, 0.0)) - (tmpvar_12.zxy * vec3(0.0, 1.0, 0.0)));
            float tmpvar_186;
            tmpvar_186 = sqrt(dot (tmpvar_185, tmpvar_185));
            if ((tmpvar_186 < 0.001)) {
              tmpvar_183 = mat3(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
            } else {
              vec3 tmpvar_187;
              tmpvar_187 = normalize(tmpvar_185);
              float tmpvar_188;
              tmpvar_188 = sin(tmpvar_184);
              float tmpvar_189;
              tmpvar_189 = cos(tmpvar_184);
              float tmpvar_190;
              tmpvar_190 = (1.0 - tmpvar_189);
              mat3 tmpvar_191;
              tmpvar_191[0].x = (((tmpvar_190 * tmpvar_187.x) * tmpvar_187.x) + tmpvar_189);
              tmpvar_191[0].y = (((tmpvar_190 * tmpvar_187.x) * tmpvar_187.y) - (tmpvar_187.z * tmpvar_188));
              tmpvar_191[0].z = (((tmpvar_190 * tmpvar_187.z) * tmpvar_187.x) + (tmpvar_187.y * tmpvar_188));
              tmpvar_191[1].x = (((tmpvar_190 * tmpvar_187.x) * tmpvar_187.y) + (tmpvar_187.z * tmpvar_188));
              tmpvar_191[1].y = (((tmpvar_190 * tmpvar_187.y) * tmpvar_187.y) + tmpvar_189);
              tmpvar_191[1].z = (((tmpvar_190 * tmpvar_187.y) * tmpvar_187.z) - (tmpvar_187.x * tmpvar_188));
              tmpvar_191[2].x = (((tmpvar_190 * tmpvar_187.z) * tmpvar_187.x) - (tmpvar_187.y * tmpvar_188));
              tmpvar_191[2].y = (((tmpvar_190 * tmpvar_187.y) * tmpvar_187.z) + (tmpvar_187.x * tmpvar_188));
              tmpvar_191[2].z = (((tmpvar_190 * tmpvar_187.z) * tmpvar_187.z) + tmpvar_189);
              tmpvar_183 = tmpvar_191;
            };
            tmpvar_12 = (tmpvar_183 * normalFromMap_181);
          };
        };
      };
      bounceCount_4++;
      vec3 tmpvar_192;
      bool tmpvar_193;
      bool tmpvar_194;
      vec3 tmpvar_195;
      float tmpvar_196;
      Material tmpvar_197;
      if ((tmpvar_17 == 0)) {
        tmpvar_197 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
      } else {
        if ((tmpvar_17 == 1)) {
          tmpvar_197 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_17 == 2)) {
            tmpvar_197 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_17 == 3)) {
              tmpvar_197 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_17 == 4)) {
                tmpvar_197 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if (((tmpvar_17 == 5) || (tmpvar_17 == 6))) {
                  tmpvar_197 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_17 == 7)) {
                    tmpvar_197 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_17 == 8)) {
                      tmpvar_197 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                    } else {
                      if ((tmpvar_17 == 9)) {
                        tmpvar_197 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                      } else {
                        if (((tmpvar_17 >= 10) && (tmpvar_17 < 110))) {
                          tmpvar_197 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                        } else {
                          if (((tmpvar_17 == 110) || (tmpvar_17 == 111))) {
                            tmpvar_197 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                          } else {
                            if (((tmpvar_17 > 111) && (tmpvar_17 < 124))) {
                              tmpvar_197 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                            } else {
                              if ((tmpvar_17 == 124)) {
                                tmpvar_197 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                              } else {
                                if ((tmpvar_17 == 125)) {
                                  tmpvar_197 = Material(vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.4), vec3(0.8, 0.8, 0.8), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_17 > 125)) {
                                    tmpvar_197 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_197 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
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
      tmpvar_192 = tmpvar_197.amb;
      tmpvar_193 = tmpvar_197.refractive;
      tmpvar_194 = tmpvar_197.reflective;
      tmpvar_195 = tmpvar_197.f0;
      tmpvar_196 = tmpvar_197.n;
      vec3 tmpvar_198;
      if ((tmpvar_17 == 0)) {
        tmpvar_198 = tmpvar_192;
      } else {
        int tmpvar_199;
        vec3 tmpvar_200;
        vec3 tmpvar_201;
        tmpvar_199 = tmpvar_17;
        tmpvar_200 = tmpvar_19;
        tmpvar_201 = tmpvar_12;
        int j_202;
        vec3 specular_203;
        vec3 diffuse_204;
        vec3 color_205;
        vec3 refDir_206;
        vec3 I_207;
        I_207 = (tmpvar_19 - ray_1.origin);
        refDir_206 = normalize((I_207 - (2.0 * 
          (dot (tmpvar_12, I_207) * tmpvar_12)
        )));
        Material tmpvar_208;
        if ((tmpvar_17 == 0)) {
          tmpvar_208 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_17 == 1)) {
            tmpvar_208 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_17 == 2)) {
              tmpvar_208 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_17 == 3)) {
                tmpvar_208 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_17 == 4)) {
                  tmpvar_208 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if (((tmpvar_17 == 5) || (tmpvar_17 == 6))) {
                    tmpvar_208 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_17 == 7)) {
                      tmpvar_208 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_17 == 8)) {
                        tmpvar_208 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                      } else {
                        if ((tmpvar_17 == 9)) {
                          tmpvar_208 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                        } else {
                          if (((tmpvar_17 >= 10) && (tmpvar_17 < 110))) {
                            tmpvar_208 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                          } else {
                            if (((tmpvar_17 == 110) || (tmpvar_17 == 111))) {
                              tmpvar_208 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_17 > 111) && (tmpvar_17 < 124))) {
                                tmpvar_208 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                              } else {
                                if ((tmpvar_17 == 124)) {
                                  tmpvar_208 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_17 == 125)) {
                                    tmpvar_208 = Material(vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.4), vec3(0.8, 0.8, 0.8), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    if ((tmpvar_17 > 125)) {
                                      tmpvar_208 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                    } else {
                                      tmpvar_208 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
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
        color_205 = tmpvar_208.amb;
        diffuse_204 = vec3(0.0, 0.0, 0.0);
        specular_203 = vec3(0.0, 0.0, 0.0);
        j_202 = 0;
        while (true) {
          float diffintensity_209;
          if ((j_202 >= 3)) {
            break;
          };
          vec3 tmpvar_210;
          tmpvar_210 = normalize((lights[j_202].pos - tmpvar_200));
          diffintensity_209 = clamp (dot (tmpvar_201, tmpvar_210), 0.0, 1.0);
          vec3 tmpvar_211;
          Material tmpvar_212;
          if ((tmpvar_199 == 0)) {
            tmpvar_212 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_199 == 1)) {
              tmpvar_212 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_199 == 2)) {
                tmpvar_212 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_199 == 3)) {
                  tmpvar_212 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_199 == 4)) {
                    tmpvar_212 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if (((tmpvar_199 == 5) || (tmpvar_199 == 6))) {
                      tmpvar_212 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_199 == 7)) {
                        tmpvar_212 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_199 == 8)) {
                          tmpvar_212 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_199 == 9)) {
                            tmpvar_212 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_199 >= 10) && (tmpvar_199 < 110))) {
                              tmpvar_212 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_199 == 110) || (tmpvar_199 == 111))) {
                                tmpvar_212 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if (((tmpvar_199 > 111) && (tmpvar_199 < 124))) {
                                  tmpvar_212 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                                } else {
                                  if ((tmpvar_199 == 124)) {
                                    tmpvar_212 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    if ((tmpvar_199 == 125)) {
                                      tmpvar_212 = Material(vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.4), vec3(0.8, 0.8, 0.8), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                    } else {
                                      if ((tmpvar_199 > 125)) {
                                        tmpvar_212 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                      } else {
                                        tmpvar_212 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
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
          tmpvar_211 = tmpvar_212.spec;
          float tmpvar_213;
          tmpvar_213 = clamp (dot (tmpvar_210, refDir_206), 0.0, 1.0);
          Material tmpvar_214;
          if ((tmpvar_199 == 0)) {
            tmpvar_214 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_199 == 1)) {
              tmpvar_214 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_199 == 2)) {
                tmpvar_214 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_199 == 3)) {
                  tmpvar_214 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_199 == 4)) {
                    tmpvar_214 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if (((tmpvar_199 == 5) || (tmpvar_199 == 6))) {
                      tmpvar_214 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_199 == 7)) {
                        tmpvar_214 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_199 == 8)) {
                          tmpvar_214 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_199 == 9)) {
                            tmpvar_214 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_199 >= 10) && (tmpvar_199 < 110))) {
                              tmpvar_214 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_199 == 110) || (tmpvar_199 == 111))) {
                                tmpvar_214 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if (((tmpvar_199 > 111) && (tmpvar_199 < 124))) {
                                  tmpvar_214 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                                } else {
                                  if ((tmpvar_199 == 124)) {
                                    tmpvar_214 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    if ((tmpvar_199 == 125)) {
                                      tmpvar_214 = Material(vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.4), vec3(0.8, 0.8, 0.8), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                    } else {
                                      if ((tmpvar_199 > 125)) {
                                        tmpvar_214 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                      } else {
                                        tmpvar_214 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
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
          specular_203 = clamp (((tmpvar_211 * lights[j_202].col) * pow (tmpvar_213, tmpvar_214.pow)), 0.0, 1.0);
          Material tmpvar_215;
          if ((tmpvar_199 == 0)) {
            tmpvar_215 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_199 == 1)) {
              tmpvar_215 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_199 == 2)) {
                tmpvar_215 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_199 == 3)) {
                  tmpvar_215 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_199 == 4)) {
                    tmpvar_215 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if (((tmpvar_199 == 5) || (tmpvar_199 == 6))) {
                      tmpvar_215 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_199 == 7)) {
                        tmpvar_215 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_199 == 8)) {
                          tmpvar_215 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_199 == 9)) {
                            tmpvar_215 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_199 >= 10) && (tmpvar_199 < 110))) {
                              tmpvar_215 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_199 == 110) || (tmpvar_199 == 111))) {
                                tmpvar_215 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if (((tmpvar_199 > 111) && (tmpvar_199 < 124))) {
                                  tmpvar_215 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                                } else {
                                  if ((tmpvar_199 == 124)) {
                                    tmpvar_215 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    if ((tmpvar_199 == 125)) {
                                      tmpvar_215 = Material(vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.4), vec3(0.8, 0.8, 0.8), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                    } else {
                                      if ((tmpvar_199 > 125)) {
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
          diffuse_204 = clamp (((tmpvar_215.dif * diffintensity_209) * lights[j_202].col), 0.0, 1.0);
          if (isShadowOn) {
            vec3 tmpvar_216;
            vec3 tmpvar_217;
            tmpvar_216 = (tmpvar_200 + (tmpvar_201 * 0.001));
            tmpvar_217 = normalize((lights[j_202].pos - tmpvar_200));
            int tmpvar_218;
            tmpvar_218 = tmpvar_199;
            int i_219;
            int i_220;
            float minT_221;
            minT_221 = -1.0;
            i_220 = 0;
            while (true) {
              if ((i_220 >= 110)) {
                break;
              };
              vec4 sphere_222;
              sphere_222 = spheres[i_220];
              int tmpvar_223;
              float tmpvar_224;
              bool tmpvar_225;
              float t_226;
              float t2_227;
              float t1_228;
              vec3 tmpvar_229;
              tmpvar_229 = (tmpvar_216 - sphere_222.xyz);
              float tmpvar_230;
              tmpvar_230 = (dot (tmpvar_229, tmpvar_217) * 2.0);
              float tmpvar_231;
              tmpvar_231 = dot (tmpvar_217, tmpvar_217);
              float tmpvar_232;
              tmpvar_232 = ((tmpvar_230 * tmpvar_230) - ((4.0 * tmpvar_231) * (
                dot (tmpvar_229, tmpvar_229)
               - 
                (sphere_222.w * sphere_222.w)
              )));
              if ((tmpvar_232 < 0.0)) {
                tmpvar_225 = bool(0);
              } else {
                float tmpvar_233;
                tmpvar_233 = sqrt(tmpvar_232);
                float tmpvar_234;
                tmpvar_234 = (((
                  -(tmpvar_230)
                 + tmpvar_233) / 2.0) / tmpvar_231);
                t1_228 = tmpvar_234;
                float tmpvar_235;
                tmpvar_235 = (((
                  -(tmpvar_230)
                 - tmpvar_233) / 2.0) / tmpvar_231);
                t2_227 = tmpvar_235;
                if ((tmpvar_234 < 0.001)) {
                  t1_228 = -0.001;
                };
                if ((tmpvar_235 < 0.001)) {
                  t2_227 = -0.001;
                };
                if ((t1_228 < 0.0)) {
                  tmpvar_225 = bool(0);
                } else {
                  if ((t2_227 > 0.0)) {
                    t_226 = t2_227;
                  } else {
                    t_226 = t1_228;
                  };
                  tmpvar_223 = i_220;
                  tmpvar_224 = t_226;
                  tmpvar_225 = bool(1);
                };
              };
              if ((tmpvar_225 && ((tmpvar_224 < minT_221) || (minT_221 < 0.0)))) {
                minT_221 = tmpvar_224;
                tmpvar_218 = tmpvar_223;
              };
              i_220++;
            };
            i_219 = 110;
            while (true) {
              if ((i_219 >= 124)) {
                break;
              };
              Triangle t_236;
              t_236 = triangles[(i_219 - 110)];
              int tmpvar_237;
              float tmpvar_238;
              bool tmpvar_239;
              float t1_240;
              float v_241;
              float u_242;
              float invDet_243;
              vec3 T_244;
              vec3 e2_245;
              vec3 e1_246;
              e1_246 = (t_236.B - t_236.A);
              e2_245 = (t_236.C - t_236.A);
              vec3 tmpvar_247;
              tmpvar_247 = ((tmpvar_217.yzx * e2_245.zxy) - (tmpvar_217.zxy * e2_245.yzx));
              invDet_243 = (1.0/(dot (e1_246, tmpvar_247)));
              T_244 = (tmpvar_216 - t_236.A);
              u_242 = (dot (T_244, tmpvar_247) * invDet_243);
              if (((u_242 < 0.0) || (u_242 > 1.0))) {
                tmpvar_239 = bool(0);
              } else {
                vec3 tmpvar_248;
                tmpvar_248 = ((T_244.yzx * e1_246.zxy) - (T_244.zxy * e1_246.yzx));
                v_241 = (dot (tmpvar_217, tmpvar_248) * invDet_243);
                if (((v_241 < 0.0) || ((u_242 + v_241) > 1.0))) {
                  tmpvar_239 = bool(0);
                } else {
                  t1_240 = (dot (e2_245, tmpvar_248) * invDet_243);
                  if ((t1_240 > 0.001)) {
                    tmpvar_238 = t1_240;
                    tmpvar_237 = i_219;
                    tmpvar_239 = bool(1);
                  } else {
                    tmpvar_239 = bool(0);
                  };
                };
              };
              if ((tmpvar_239 && ((tmpvar_238 < minT_221) || (minT_221 < 0.0)))) {
                minT_221 = tmpvar_238;
                tmpvar_218 = tmpvar_237;
              };
              i_219++;
            };
            vec3 tmpvar_249;
            float tmpvar_250;
            vec3 tmpvar_251;
            tmpvar_249 = ground.o;
            tmpvar_250 = ground.r;
            tmpvar_251 = ground.n;
            bool tmpvar_252;
            float tmpvar_253;
            bool tmpvar_254;
            float tmpvar_255;
            tmpvar_255 = (dot (tmpvar_251, (tmpvar_249 - tmpvar_216)) / dot (tmpvar_251, tmpvar_217));
            if ((tmpvar_255 < 0.001)) {
              tmpvar_254 = bool(0);
            } else {
              tmpvar_253 = tmpvar_255;
              tmpvar_254 = bool(1);
            };
            if (tmpvar_254) {
              vec3 tmpvar_256;
              tmpvar_256 = ((tmpvar_216 + (tmpvar_253 * tmpvar_217)) - tmpvar_249);
              float tmpvar_257;
              tmpvar_257 = sqrt(dot (tmpvar_256, tmpvar_256));
              if ((tmpvar_257 > tmpvar_250)) {
                tmpvar_252 = bool(0);
              } else {
                tmpvar_252 = bool(1);
              };
            } else {
              tmpvar_252 = bool(0);
            };
            if ((tmpvar_252 && ((tmpvar_253 < minT_221) || (minT_221 < 0.0)))) {
              minT_221 = tmpvar_253;
              tmpvar_218 = 124;
            };
            vec3 tmpvar_258;
            tmpvar_258 = skyboxBack.n;
            float tmpvar_259;
            bool tmpvar_260;
            float tmpvar_261;
            tmpvar_261 = (dot (tmpvar_258, (skyboxBack.q - tmpvar_216)) / dot (tmpvar_258, tmpvar_217));
            if ((tmpvar_261 < 0.001)) {
              tmpvar_260 = bool(0);
            } else {
              tmpvar_259 = tmpvar_261;
              tmpvar_260 = bool(1);
            };
            if ((tmpvar_260 && ((tmpvar_259 < minT_221) || (minT_221 < 0.0)))) {
              minT_221 = tmpvar_259;
              tmpvar_218 = 126;
            };
            vec3 tmpvar_262;
            tmpvar_262 = skyboxDown.n;
            float tmpvar_263;
            bool tmpvar_264;
            float tmpvar_265;
            tmpvar_265 = (dot (tmpvar_262, (skyboxDown.q - tmpvar_216)) / dot (tmpvar_262, tmpvar_217));
            if ((tmpvar_265 < 0.001)) {
              tmpvar_264 = bool(0);
            } else {
              tmpvar_263 = tmpvar_265;
              tmpvar_264 = bool(1);
            };
            if ((tmpvar_264 && ((tmpvar_263 < minT_221) || (minT_221 < 0.0)))) {
              minT_221 = tmpvar_263;
              tmpvar_218 = 127;
            };
            vec3 tmpvar_266;
            tmpvar_266 = skyboxFront.n;
            float tmpvar_267;
            bool tmpvar_268;
            float tmpvar_269;
            tmpvar_269 = (dot (tmpvar_266, (skyboxFront.q - tmpvar_216)) / dot (tmpvar_266, tmpvar_217));
            if ((tmpvar_269 < 0.001)) {
              tmpvar_268 = bool(0);
            } else {
              tmpvar_267 = tmpvar_269;
              tmpvar_268 = bool(1);
            };
            if ((tmpvar_268 && ((tmpvar_267 < minT_221) || (minT_221 < 0.0)))) {
              minT_221 = tmpvar_267;
              tmpvar_218 = 128;
            };
            vec3 tmpvar_270;
            tmpvar_270 = skyboxLeft.n;
            float tmpvar_271;
            bool tmpvar_272;
            float tmpvar_273;
            tmpvar_273 = (dot (tmpvar_270, (skyboxLeft.q - tmpvar_216)) / dot (tmpvar_270, tmpvar_217));
            if ((tmpvar_273 < 0.001)) {
              tmpvar_272 = bool(0);
            } else {
              tmpvar_271 = tmpvar_273;
              tmpvar_272 = bool(1);
            };
            if ((tmpvar_272 && ((tmpvar_271 < minT_221) || (minT_221 < 0.0)))) {
              minT_221 = tmpvar_271;
              tmpvar_218 = 129;
            };
            vec3 tmpvar_274;
            tmpvar_274 = skyboxRight.n;
            float tmpvar_275;
            bool tmpvar_276;
            float tmpvar_277;
            tmpvar_277 = (dot (tmpvar_274, (skyboxRight.q - tmpvar_216)) / dot (tmpvar_274, tmpvar_217));
            if ((tmpvar_277 < 0.001)) {
              tmpvar_276 = bool(0);
            } else {
              tmpvar_275 = tmpvar_277;
              tmpvar_276 = bool(1);
            };
            if ((tmpvar_276 && ((tmpvar_275 < minT_221) || (minT_221 < 0.0)))) {
              minT_221 = tmpvar_275;
              tmpvar_218 = 130;
            };
            vec3 tmpvar_278;
            tmpvar_278 = skyboxUp.n;
            float tmpvar_279;
            bool tmpvar_280;
            float tmpvar_281;
            tmpvar_281 = (dot (tmpvar_278, (skyboxUp.q - tmpvar_216)) / dot (tmpvar_278, tmpvar_217));
            if ((tmpvar_281 < 0.001)) {
              tmpvar_280 = bool(0);
            } else {
              tmpvar_279 = tmpvar_281;
              tmpvar_280 = bool(1);
            };
            if ((tmpvar_280 && ((tmpvar_279 < minT_221) || (minT_221 < 0.0)))) {
              minT_221 = tmpvar_279;
              tmpvar_218 = 131;
            };
            if ((((
              (((tmpvar_218 != 0) && (tmpvar_218 != 5)) && (tmpvar_218 != 6))
             && 
              (tmpvar_218 != 124)
            ) && (tmpvar_218 != tmpvar_199)) && (tmpvar_199 <= 124))) {
              specular_203 = vec3(0.0, 0.0, 0.0);
              diffuse_204 = vec3(0.0, 0.0, 0.0);
            };
          };
          color_205 = (color_205 + (diffuse_204 + specular_203));
          j_202++;
        };
        tmpvar_198 = color_205;
      };
      color_14 = (color_14 + (tmpvar_198 * coeff_3));
      if ((tmpvar_17 == 0)) {
        float tmpvar_282;
        tmpvar_282 = (time / 5.0);
        u_8 = (u_8 + tmpvar_282);
        v_7 = (v_7 + tmpvar_282);
        vec2 tmpvar_283;
        tmpvar_283.x = u_8;
        tmpvar_283.y = v_7;
        color_14 = (color_14 * (texture2D (sunTexture, tmpvar_283).xyz + vec3(0.0, 0.0, 0.5)));
      } else {
        if ((tmpvar_17 == 3)) {
          if (!(useNormalMap)) {
            u_8 = (u_8 + (time / 2.0));
          };
          vec2 tmpvar_284;
          tmpvar_284.x = u_8;
          tmpvar_284.y = v_7;
          color_14 = (color_14 * texture2D (earthTexture, tmpvar_284).xyz);
        } else {
          if ((tmpvar_17 == 4)) {
            if (!(useNormalMap)) {
              u_8 = (u_8 + (time / 7.0));
            };
            vec2 tmpvar_285;
            tmpvar_285.x = u_8;
            tmpvar_285.y = v_7;
            color_14 = (color_14 * texture2D (moonTexture, tmpvar_285).xyz);
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
      bool tmpvar_286;
      tmpvar_286 = (((tmpvar_17 == 3) && (color_14.z > color_14.x)) && (color_14.z > color_14.y));
      if ((((tmpvar_194 || tmpvar_193) || tmpvar_286) && (bounceCount_4 <= depth))) {
        bool totalInternalReflection_287;
        totalInternalReflection_287 = bool(0);
        if (tmpvar_193) {
          Ray refractedRay_288;
          float tmpvar_289;
          tmpvar_289 = (1.0/(tmpvar_196));
          float tmpvar_290;
          tmpvar_290 = dot (ray_1.dir, tmpvar_12);
          vec3 tmpvar_291;
          if ((tmpvar_290 <= 0.0)) {
            vec3 I_292;
            I_292 = ray_1.dir;
            vec3 tmpvar_293;
            float tmpvar_294;
            tmpvar_294 = dot (tmpvar_12, I_292);
            float tmpvar_295;
            tmpvar_295 = (1.0 - (tmpvar_289 * (tmpvar_289 * 
              (1.0 - (tmpvar_294 * tmpvar_294))
            )));
            if ((tmpvar_295 < 0.0)) {
              tmpvar_293 = vec3(0.0, 0.0, 0.0);
            } else {
              tmpvar_293 = ((tmpvar_289 * I_292) - ((
                (tmpvar_289 * tmpvar_294)
               + 
                sqrt(tmpvar_295)
              ) * tmpvar_12));
            };
            tmpvar_291 = tmpvar_293;
          } else {
            vec3 I_296;
            I_296 = ray_1.dir;
            vec3 N_297;
            N_297 = -(tmpvar_12);
            float eta_298;
            eta_298 = (1.0/(tmpvar_289));
            vec3 tmpvar_299;
            float tmpvar_300;
            tmpvar_300 = dot (N_297, I_296);
            float tmpvar_301;
            tmpvar_301 = (1.0 - (eta_298 * (eta_298 * 
              (1.0 - (tmpvar_300 * tmpvar_300))
            )));
            if ((tmpvar_301 < 0.0)) {
              tmpvar_299 = vec3(0.0, 0.0, 0.0);
            } else {
              tmpvar_299 = ((eta_298 * I_296) - ((
                (eta_298 * tmpvar_300)
               + 
                sqrt(tmpvar_301)
              ) * N_297));
            };
            tmpvar_291 = tmpvar_299;
          };
          refractedRay_288.dir = tmpvar_291;
          vec3 x_302;
          x_302 = refractedRay_288.dir;
          totalInternalReflection_287 = (sqrt(dot (x_302, x_302)) < 0.001);
          if (totalInternalReflection_287) {
            vec3 I_303;
            I_303 = ray_1.dir;
            vec3 N_304;
            N_304 = -(tmpvar_12);
            ray_1.dir = normalize((I_303 - (2.0 * 
              (dot (N_304, I_303) * N_304)
            )));
            ray_1.origin = (tmpvar_19 - (tmpvar_12 * 0.001));
          } else {
            refractedRay_288.origin = (tmpvar_19 + ((tmpvar_12 * 0.001) * sign(
              dot (ray_1.dir, tmpvar_12)
            )));
            refractedRay_288.dir = normalize(refractedRay_288.dir);
            if (!(tmpvar_194)) {
              ray_1 = refractedRay_288;
            } else {
              stack_6[stackSize_5].coeff = (coeff_3 * (vec3(1.0, 1.0, 1.0) - (tmpvar_195 + 
                ((vec3(1.0, 1.0, 1.0) - tmpvar_195) * pow ((1.0 - abs(
                  dot (tmpvar_12, refractedRay_288.dir)
                )), 5.0))
              )));
              stack_6[stackSize_5].depth = bounceCount_4;
              int tmpvar_305;
              tmpvar_305 = stackSize_5;
              stackSize_5++;
              stack_6[tmpvar_305].ray = refractedRay_288;
            };
          };
        };
        if ((((tmpvar_194 && 
          !(totalInternalReflection_287)
        ) && (tmpvar_17 != 3)) || tmpvar_286)) {
          float tmpvar_306;
          tmpvar_306 = dot (ray_1.dir, tmpvar_12);
          if ((tmpvar_306 < 0.0)) {
            coeff_3 = (coeff_3 * (tmpvar_195 + (
              (vec3(1.0, 1.0, 1.0) - tmpvar_195)
             * 
              pow ((1.0 - abs(dot (tmpvar_12, ray_1.dir))), 5.0)
            )));
            vec3 I_307;
            I_307 = ray_1.dir;
            ray_1.dir = normalize((I_307 - (2.0 * 
              (dot (tmpvar_12, I_307) * tmpvar_12)
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
      vec3 glowness_308;
      vec3 tmpvar_309;
      tmpvar_309 = normalize(ray_1.dir);
      vec3 tmpvar_310;
      tmpvar_310 = (ray_1.origin + (abs(
        dot ((spheres[0].xyz - ray_1.origin), tmpvar_309)
      ) * tmpvar_309));
      float tmpvar_311;
      tmpvar_311 = sqrt(dot (tmpvar_310, tmpvar_310));
      float tmpvar_312;
      vec3 x_313;
      x_313 = (tmpvar_19 - eye);
      tmpvar_312 = sqrt(dot (x_313, x_313));
      float tmpvar_314;
      vec3 x_315;
      x_315 = (spheres[0].xyz - eye);
      tmpvar_314 = sqrt(dot (x_315, x_315));
      if (((tmpvar_312 + spheres[0].w) < tmpvar_314)) {
        glowness_308 = vec3(0.0, 0.0, 0.0);
      } else {
        glowness_308 = (vec3(1.0, 0.95, 0.1) * clamp ((2.0 / 
          (0.5 + (tmpvar_311 * tmpvar_311))
        ), 0.0, 1.0));
      };
      color_14 = (color_14 + glowness_308);
    };
    if ((!(continueLoop_2) && (stackSize_5 > 0))) {
      int tmpvar_316;
      tmpvar_316 = (stackSize_5 - 1);
      stackSize_5 = tmpvar_316;
      ray_1 = stack_6[tmpvar_316].ray;
      bounceCount_4 = stack_6[tmpvar_316].depth;
      coeff_3 = stack_6[tmpvar_316].coeff;
      continueLoop_2 = bool(1);
    };
  };
  vec4 tmpvar_317;
  tmpvar_317.w = 1.0;
  tmpvar_317.x = color_14[colorModeInTernary[0]];
  tmpvar_317.y = color_14[colorModeInTernary[1]];
  tmpvar_317.z = color_14[colorModeInTernary[2]];
  gl_FragColor = tmpvar_317;
}