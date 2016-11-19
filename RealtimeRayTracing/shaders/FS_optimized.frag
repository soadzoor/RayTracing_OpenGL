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
uniform vec4 spheres[10];
uniform float time;
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
    bool hit_23;
    float minT_24;
    minT_24 = -1.0;
    hit_23 = bool(0);
    for (int i_22 = 0; i_22 < 10; i_22++) {
      vec4 sphere_25;
      sphere_25 = spheres[i_22];
      int tmpvar_26;
      float tmpvar_27;
      vec3 tmpvar_28;
      vec3 tmpvar_29;
      vec3 tmpvar_30;
      bool tmpvar_31;
      float t_32;
      float t2_33;
      float t1_34;
      vec3 tmpvar_35;
      tmpvar_35 = (tmpvar_15 - sphere_25.xyz);
      float tmpvar_36;
      tmpvar_36 = (dot (tmpvar_35, tmpvar_16) * 2.0);
      float tmpvar_37;
      tmpvar_37 = dot (tmpvar_16, tmpvar_16);
      float tmpvar_38;
      tmpvar_38 = ((tmpvar_36 * tmpvar_36) - ((4.0 * tmpvar_37) * (
        dot (tmpvar_35, tmpvar_35)
       - 
        (sphere_25.w * sphere_25.w)
      )));
      if ((tmpvar_38 < 0.0)) {
        tmpvar_31 = bool(0);
      } else {
        float tmpvar_39;
        tmpvar_39 = sqrt(tmpvar_38);
        float tmpvar_40;
        tmpvar_40 = (((
          -(tmpvar_36)
         + tmpvar_39) / 2.0) / tmpvar_37);
        t1_34 = tmpvar_40;
        float tmpvar_41;
        tmpvar_41 = (((
          -(tmpvar_36)
         - tmpvar_39) / 2.0) / tmpvar_37);
        t2_33 = tmpvar_41;
        if ((tmpvar_40 < 0.001)) {
          t1_34 = -0.001;
        };
        if ((tmpvar_41 < 0.001)) {
          t2_33 = -0.001;
        };
        if ((t1_34 < 0.0)) {
          tmpvar_31 = bool(0);
        } else {
          if ((t2_33 > 0.0)) {
            t_32 = t2_33;
          } else {
            t_32 = t1_34;
          };
          tmpvar_26 = i_22;
          tmpvar_27 = t_32;
          tmpvar_30 = sphere_25.xyz;
          tmpvar_28 = (tmpvar_15 + (t_32 * tmpvar_16));
          tmpvar_29 = normalize((tmpvar_28 - sphere_25.xyz));
          tmpvar_31 = bool(1);
        };
      };
      if (tmpvar_31) {
        if (((tmpvar_27 < minT_24) || (minT_24 < 0.0))) {
          minT_24 = tmpvar_27;
          tmpvar_17 = tmpvar_26;
          tmpvar_18 = tmpvar_27;
          tmpvar_19 = tmpvar_28;
          tmpvar_20 = tmpvar_29;
          tmpvar_21 = tmpvar_30;
        };
        hit_23 = bool(1);
      };
    };
    float tmpvar_42;
    vec3 tmpvar_43;
    bool tmpvar_44;
    float t1_45;
    float v_46;
    float u_47;
    float invDet_48;
    vec3 T_49;
    vec3 tmpvar_50;
    tmpvar_50 = ((tmpvar_16.yzx * vec3(2.0, 28.0, -19.0)) - (tmpvar_16.zxy * vec3(-19.0, 2.0, 28.0)));
    invDet_48 = (1.0/(dot (vec3(0.0, -19.0, 2.0), tmpvar_50)));
    T_49 = (tmpvar_15 - vec3(-14.0, 14.0, -14.0));
    u_47 = (dot (T_49, tmpvar_50) * invDet_48);
    if (((u_47 < 0.0) || (u_47 > 1.0))) {
      tmpvar_44 = bool(0);
    } else {
      vec3 tmpvar_51;
      tmpvar_51 = ((T_49.yzx * vec3(2.0, 0.0, -19.0)) - (T_49.zxy * vec3(-19.0, 2.0, 0.0)));
      v_46 = (dot (tmpvar_16, tmpvar_51) * invDet_48);
      if (((v_46 < 0.0) || ((u_47 + v_46) > 1.0))) {
        tmpvar_44 = bool(0);
      } else {
        t1_45 = (dot (vec3(28.0, -19.0, 2.0), tmpvar_51) * invDet_48);
        if ((t1_45 > 0.001)) {
          tmpvar_42 = t1_45;
          tmpvar_43 = (tmpvar_15 + (tmpvar_16 * t1_45));
          tmpvar_44 = bool(1);
        } else {
          tmpvar_44 = bool(0);
        };
      };
    };
    if (tmpvar_44) {
      if (((tmpvar_42 < minT_24) || (minT_24 < 0.0))) {
        minT_24 = tmpvar_42;
        tmpvar_17 = 10;
        tmpvar_18 = tmpvar_42;
        tmpvar_19 = tmpvar_43;
        tmpvar_20 = vec3(0.0, 0.1046848, 0.9945055);
        tmpvar_21 = vec3(-4.666667, 1.333333, -12.66667);
      };
      hit_23 = bool(1);
    };
    float tmpvar_52;
    vec3 tmpvar_53;
    bool tmpvar_54;
    float t1_55;
    float v_56;
    float u_57;
    float invDet_58;
    vec3 T_59;
    vec3 tmpvar_60;
    tmpvar_60 = ((tmpvar_16.yzx * vec3(0.0, 28.0, 0.0)) - (tmpvar_16.zxy * vec3(0.0, 0.0, 28.0)));
    invDet_58 = (1.0/(dot (vec3(28.0, -19.0, 2.0), tmpvar_60)));
    T_59 = (tmpvar_15 - vec3(-14.0, 14.0, -14.0));
    u_57 = (dot (T_59, tmpvar_60) * invDet_58);
    if (((u_57 < 0.0) || (u_57 > 1.0))) {
      tmpvar_54 = bool(0);
    } else {
      vec3 tmpvar_61;
      tmpvar_61 = ((T_59.yzx * vec3(2.0, 28.0, -19.0)) - (T_59.zxy * vec3(-19.0, 2.0, 28.0)));
      v_56 = (dot (tmpvar_16, tmpvar_61) * invDet_58);
      if (((v_56 < 0.0) || ((u_57 + v_56) > 1.0))) {
        tmpvar_54 = bool(0);
      } else {
        t1_55 = (dot (vec3(28.0, 0.0, 0.0), tmpvar_61) * invDet_58);
        if ((t1_55 > 0.001)) {
          tmpvar_52 = t1_55;
          tmpvar_53 = (tmpvar_15 + (tmpvar_16 * t1_55));
          tmpvar_54 = bool(1);
        } else {
          tmpvar_54 = bool(0);
        };
      };
    };
    if (tmpvar_54) {
      if (((tmpvar_52 < minT_24) || (minT_24 < 0.0))) {
        minT_24 = tmpvar_52;
        tmpvar_17 = 11;
        tmpvar_18 = tmpvar_52;
        tmpvar_19 = tmpvar_53;
        tmpvar_20 = vec3(-0.0, 0.1046848, 0.9945055);
        tmpvar_21 = vec3(4.666667, 7.666667, -13.33333);
      };
      hit_23 = bool(1);
    };
    bool tmpvar_62;
    tmpvar_62 = bool(1);
    bool tmpvar_63;
    float tmpvar_64;
    vec3 tmpvar_65;
    bool tmpvar_66;
    float tmpvar_67;
    tmpvar_67 = ((vec3(0.0, -10.0, 0.0) - tmpvar_15).y / tmpvar_16.y);
    if ((tmpvar_67 < 0.001)) {
      tmpvar_66 = bool(0);
    } else {
      tmpvar_64 = tmpvar_67;
      tmpvar_65 = (tmpvar_15 + (tmpvar_67 * tmpvar_16));
      tmpvar_66 = bool(1);
    };
    if (tmpvar_66) {
      float tmpvar_68;
      vec3 tmpvar_69;
      tmpvar_69 = ((tmpvar_15 + (tmpvar_64 * tmpvar_16)) - vec3(0.0, -10.0, 0.0));
      tmpvar_68 = sqrt(dot (tmpvar_69, tmpvar_69));
      if ((tmpvar_68 <= 30.0)) {
        tmpvar_63 = bool(1);
        tmpvar_62 = bool(0);
      };
    };
    if (tmpvar_62) {
      tmpvar_63 = bool(0);
      tmpvar_62 = bool(0);
    };
    if (tmpvar_63) {
      if (((tmpvar_64 < minT_24) || (minT_24 < 0.0))) {
        minT_24 = tmpvar_64;
        tmpvar_17 = 12;
        tmpvar_18 = tmpvar_64;
        tmpvar_19 = tmpvar_65;
        tmpvar_20 = vec3(0.0, 1.0, 0.0);
        tmpvar_21 = vec3(0.0, -10.0, 0.0);
      };
      hit_23 = bool(1);
    };
    float tmpvar_70;
    vec3 tmpvar_71;
    bool tmpvar_72;
    float tmpvar_73;
    tmpvar_73 = (dot (vec3(0.0, 0.0, -1.0), (vec3(0.0, 0.0, 10000.0) - tmpvar_15)) / dot (vec3(0.0, 0.0, -1.0), tmpvar_16));
    if ((tmpvar_73 < 0.001)) {
      tmpvar_72 = bool(0);
    } else {
      tmpvar_70 = tmpvar_73;
      tmpvar_71 = (tmpvar_15 + (tmpvar_73 * tmpvar_16));
      tmpvar_72 = bool(1);
    };
    if (tmpvar_72) {
      if (((tmpvar_70 < minT_24) || (minT_24 < 0.0))) {
        minT_24 = tmpvar_70;
        tmpvar_17 = 14;
        tmpvar_18 = tmpvar_70;
        tmpvar_19 = tmpvar_71;
        tmpvar_20 = vec3(0.0, 0.0, -1.0);
        tmpvar_21 = vec3(0.0, 0.0, 10000.0);
      };
      hit_23 = bool(1);
    };
    float tmpvar_74;
    vec3 tmpvar_75;
    bool tmpvar_76;
    float tmpvar_77;
    tmpvar_77 = ((vec3(0.0, -10000.0, 0.0) - tmpvar_15).y / tmpvar_16.y);
    if ((tmpvar_77 < 0.001)) {
      tmpvar_76 = bool(0);
    } else {
      tmpvar_74 = tmpvar_77;
      tmpvar_75 = (tmpvar_15 + (tmpvar_77 * tmpvar_16));
      tmpvar_76 = bool(1);
    };
    if (tmpvar_76) {
      if (((tmpvar_74 < minT_24) || (minT_24 < 0.0))) {
        minT_24 = tmpvar_74;
        tmpvar_17 = 15;
        tmpvar_18 = tmpvar_74;
        tmpvar_19 = tmpvar_75;
        tmpvar_20 = vec3(0.0, 1.0, 0.0);
        tmpvar_21 = vec3(0.0, -10000.0, 0.0);
      };
      hit_23 = bool(1);
    };
    float tmpvar_78;
    vec3 tmpvar_79;
    bool tmpvar_80;
    float tmpvar_81;
    tmpvar_81 = ((vec3(0.0, 0.0, -10000.0) - tmpvar_15).z / tmpvar_16.z);
    if ((tmpvar_81 < 0.001)) {
      tmpvar_80 = bool(0);
    } else {
      tmpvar_78 = tmpvar_81;
      tmpvar_79 = (tmpvar_15 + (tmpvar_81 * tmpvar_16));
      tmpvar_80 = bool(1);
    };
    if (tmpvar_80) {
      if (((tmpvar_78 < minT_24) || (minT_24 < 0.0))) {
        minT_24 = tmpvar_78;
        tmpvar_17 = 16;
        tmpvar_18 = tmpvar_78;
        tmpvar_19 = tmpvar_79;
        tmpvar_20 = vec3(0.0, 0.0, 1.0);
        tmpvar_21 = vec3(0.0, 0.0, -10000.0);
      };
      hit_23 = bool(1);
    };
    float tmpvar_82;
    vec3 tmpvar_83;
    bool tmpvar_84;
    float tmpvar_85;
    tmpvar_85 = ((vec3(-10000.0, 0.0, 0.0) - tmpvar_15).x / tmpvar_16.x);
    if ((tmpvar_85 < 0.001)) {
      tmpvar_84 = bool(0);
    } else {
      tmpvar_82 = tmpvar_85;
      tmpvar_83 = (tmpvar_15 + (tmpvar_85 * tmpvar_16));
      tmpvar_84 = bool(1);
    };
    if (tmpvar_84) {
      if (((tmpvar_82 < minT_24) || (minT_24 < 0.0))) {
        minT_24 = tmpvar_82;
        tmpvar_17 = 17;
        tmpvar_18 = tmpvar_82;
        tmpvar_19 = tmpvar_83;
        tmpvar_20 = vec3(1.0, 0.0, 0.0);
        tmpvar_21 = vec3(-10000.0, 0.0, 0.0);
      };
      hit_23 = bool(1);
    };
    float tmpvar_86;
    vec3 tmpvar_87;
    bool tmpvar_88;
    float tmpvar_89;
    tmpvar_89 = (dot (vec3(-1.0, 0.0, 0.0), (vec3(10000.0, 0.0, 0.0) - tmpvar_15)) / dot (vec3(-1.0, 0.0, 0.0), tmpvar_16));
    if ((tmpvar_89 < 0.001)) {
      tmpvar_88 = bool(0);
    } else {
      tmpvar_86 = tmpvar_89;
      tmpvar_87 = (tmpvar_15 + (tmpvar_89 * tmpvar_16));
      tmpvar_88 = bool(1);
    };
    if (tmpvar_88) {
      if (((tmpvar_86 < minT_24) || (minT_24 < 0.0))) {
        minT_24 = tmpvar_86;
        tmpvar_17 = 18;
        tmpvar_18 = tmpvar_86;
        tmpvar_19 = tmpvar_87;
        tmpvar_20 = vec3(-1.0, 0.0, 0.0);
        tmpvar_21 = vec3(10000.0, 0.0, 0.0);
      };
      hit_23 = bool(1);
    };
    float tmpvar_90;
    vec3 tmpvar_91;
    bool tmpvar_92;
    float tmpvar_93;
    tmpvar_93 = (dot (vec3(0.0, -1.0, 0.0), (vec3(0.0, 10000.0, 0.0) - tmpvar_15)) / dot (vec3(0.0, -1.0, 0.0), tmpvar_16));
    if ((tmpvar_93 < 0.001)) {
      tmpvar_92 = bool(0);
    } else {
      tmpvar_90 = tmpvar_93;
      tmpvar_91 = (tmpvar_15 + (tmpvar_93 * tmpvar_16));
      tmpvar_92 = bool(1);
    };
    if (tmpvar_92) {
      if (((tmpvar_90 < minT_24) || (minT_24 < 0.0))) {
        minT_24 = tmpvar_90;
        tmpvar_17 = 19;
        tmpvar_18 = tmpvar_90;
        tmpvar_19 = tmpvar_91;
        tmpvar_20 = vec3(0.0, -1.0, 0.0);
        tmpvar_21 = vec3(0.0, 10000.0, 0.0);
      };
      hit_23 = bool(1);
    };
    tmpvar_9 = tmpvar_17;
    tmpvar_10 = tmpvar_18;
    tmpvar_11 = tmpvar_19;
    tmpvar_12 = tmpvar_20;
    tmpvar_13 = tmpvar_21;
    if (hit_23) {
      float vec_y_94;
      vec_y_94 = -(tmpvar_20.z);
      float vec_x_95;
      vec_x_95 = -(tmpvar_20.x);
      float tmpvar_96;
      float tmpvar_97;
      tmpvar_97 = (min (abs(
        (vec_y_94 / vec_x_95)
      ), 1.0) / max (abs(
        (vec_y_94 / vec_x_95)
      ), 1.0));
      float tmpvar_98;
      tmpvar_98 = (tmpvar_97 * tmpvar_97);
      tmpvar_98 = (((
        ((((
          ((((-0.01213232 * tmpvar_98) + 0.05368138) * tmpvar_98) - 0.1173503)
         * tmpvar_98) + 0.1938925) * tmpvar_98) - 0.3326756)
       * tmpvar_98) + 0.9999793) * tmpvar_97);
      tmpvar_98 = (tmpvar_98 + (float(
        (abs((vec_y_94 / vec_x_95)) > 1.0)
      ) * (
        (tmpvar_98 * -2.0)
       + 1.570796)));
      tmpvar_96 = (tmpvar_98 * sign((vec_y_94 / vec_x_95)));
      if ((abs(vec_x_95) > (1e-08 * abs(vec_y_94)))) {
        if ((vec_x_95 < 0.0)) {
          if ((vec_y_94 >= 0.0)) {
            tmpvar_96 += 3.141593;
          } else {
            tmpvar_96 = (tmpvar_96 - 3.141593);
          };
        };
      } else {
        tmpvar_96 = (sign(vec_y_94) * 1.570796);
      };
      u_8 = (0.5 - (tmpvar_96 / 6.283185));
      float x_99;
      x_99 = -(tmpvar_20.y);
      v_7 = (0.5 + ((
        sign(x_99)
       * 
        (1.570796 - (sqrt((1.0 - 
          abs(x_99)
        )) * (1.570796 + (
          abs(x_99)
         * 
          (-0.2146018 + (abs(x_99) * (0.08656672 + (
            abs(x_99)
           * -0.03102955))))
        ))))
      ) / 3.141593));
      if (useNormalMap) {
        if ((tmpvar_17 == 3)) {
          vec3 normalFromMap_100;
          u_8 = (u_8 + (time / 2.0));
          vec2 tmpvar_101;
          tmpvar_101.x = u_8;
          tmpvar_101.y = v_7;
          normalFromMap_100 = normalize(((2.0 * texture2D (earthNormalMap, tmpvar_101).xyz) - 1.0));
          mat3 tmpvar_102;
          float tmpvar_103;
          tmpvar_103 = (1.570796 - (sign(tmpvar_20.z) * (1.570796 - 
            (sqrt((1.0 - abs(tmpvar_20.z))) * (1.570796 + (abs(tmpvar_20.z) * (-0.2146018 + 
              (abs(tmpvar_20.z) * (0.08656672 + (abs(tmpvar_20.z) * -0.03102955)))
            ))))
          )));
          vec3 tmpvar_104;
          tmpvar_104 = ((tmpvar_20.yzx * vec3(1.0, 0.0, 0.0)) - (tmpvar_20.zxy * vec3(0.0, 1.0, 0.0)));
          float tmpvar_105;
          tmpvar_105 = sqrt(dot (tmpvar_104, tmpvar_104));
          if ((tmpvar_105 < 0.001)) {
            tmpvar_102 = mat3(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
          } else {
            vec3 tmpvar_106;
            tmpvar_106 = normalize(tmpvar_104);
            float tmpvar_107;
            tmpvar_107 = sin(tmpvar_103);
            float tmpvar_108;
            tmpvar_108 = cos(tmpvar_103);
            float tmpvar_109;
            tmpvar_109 = (1.0 - tmpvar_108);
            mat3 tmpvar_110;
            tmpvar_110[0].x = (((tmpvar_109 * tmpvar_106.x) * tmpvar_106.x) + tmpvar_108);
            tmpvar_110[0].y = (((tmpvar_109 * tmpvar_106.x) * tmpvar_106.y) - (tmpvar_106.z * tmpvar_107));
            tmpvar_110[0].z = (((tmpvar_109 * tmpvar_106.z) * tmpvar_106.x) + (tmpvar_106.y * tmpvar_107));
            tmpvar_110[1].x = (((tmpvar_109 * tmpvar_106.x) * tmpvar_106.y) + (tmpvar_106.z * tmpvar_107));
            tmpvar_110[1].y = (((tmpvar_109 * tmpvar_106.y) * tmpvar_106.y) + tmpvar_108);
            tmpvar_110[1].z = (((tmpvar_109 * tmpvar_106.y) * tmpvar_106.z) - (tmpvar_106.x * tmpvar_107));
            tmpvar_110[2].x = (((tmpvar_109 * tmpvar_106.z) * tmpvar_106.x) - (tmpvar_106.y * tmpvar_107));
            tmpvar_110[2].y = (((tmpvar_109 * tmpvar_106.y) * tmpvar_106.z) + (tmpvar_106.x * tmpvar_107));
            tmpvar_110[2].z = (((tmpvar_109 * tmpvar_106.z) * tmpvar_106.z) + tmpvar_108);
            tmpvar_102 = tmpvar_110;
          };
          tmpvar_12 = (tmpvar_102 * normalFromMap_100);
        } else {
          if ((tmpvar_17 == 4)) {
            vec3 normalFromMap_111;
            u_8 = (u_8 + (time / 7.0));
            vec2 tmpvar_112;
            tmpvar_112.x = u_8;
            tmpvar_112.y = v_7;
            normalFromMap_111 = normalize(((2.0 * texture2D (moonNormalMap, tmpvar_112).xyz) - 1.0));
            mat3 tmpvar_113;
            float tmpvar_114;
            tmpvar_114 = (1.570796 - (sign(tmpvar_12.z) * (1.570796 - 
              (sqrt((1.0 - abs(tmpvar_12.z))) * (1.570796 + (abs(tmpvar_12.z) * (-0.2146018 + 
                (abs(tmpvar_12.z) * (0.08656672 + (abs(tmpvar_12.z) * -0.03102955)))
              ))))
            )));
            vec3 tmpvar_115;
            tmpvar_115 = ((tmpvar_12.yzx * vec3(1.0, 0.0, 0.0)) - (tmpvar_12.zxy * vec3(0.0, 1.0, 0.0)));
            float tmpvar_116;
            tmpvar_116 = sqrt(dot (tmpvar_115, tmpvar_115));
            if ((tmpvar_116 < 0.001)) {
              tmpvar_113 = mat3(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
            } else {
              vec3 tmpvar_117;
              tmpvar_117 = normalize(tmpvar_115);
              float tmpvar_118;
              tmpvar_118 = sin(tmpvar_114);
              float tmpvar_119;
              tmpvar_119 = cos(tmpvar_114);
              float tmpvar_120;
              tmpvar_120 = (1.0 - tmpvar_119);
              mat3 tmpvar_121;
              tmpvar_121[0].x = (((tmpvar_120 * tmpvar_117.x) * tmpvar_117.x) + tmpvar_119);
              tmpvar_121[0].y = (((tmpvar_120 * tmpvar_117.x) * tmpvar_117.y) - (tmpvar_117.z * tmpvar_118));
              tmpvar_121[0].z = (((tmpvar_120 * tmpvar_117.z) * tmpvar_117.x) + (tmpvar_117.y * tmpvar_118));
              tmpvar_121[1].x = (((tmpvar_120 * tmpvar_117.x) * tmpvar_117.y) + (tmpvar_117.z * tmpvar_118));
              tmpvar_121[1].y = (((tmpvar_120 * tmpvar_117.y) * tmpvar_117.y) + tmpvar_119);
              tmpvar_121[1].z = (((tmpvar_120 * tmpvar_117.y) * tmpvar_117.z) - (tmpvar_117.x * tmpvar_118));
              tmpvar_121[2].x = (((tmpvar_120 * tmpvar_117.z) * tmpvar_117.x) - (tmpvar_117.y * tmpvar_118));
              tmpvar_121[2].y = (((tmpvar_120 * tmpvar_117.y) * tmpvar_117.z) + (tmpvar_117.x * tmpvar_118));
              tmpvar_121[2].z = (((tmpvar_120 * tmpvar_117.z) * tmpvar_117.z) + tmpvar_119);
              tmpvar_113 = tmpvar_121;
            };
            tmpvar_12 = (tmpvar_113 * normalFromMap_111);
          };
        };
      };
      bounceCount_4++;
      vec3 tmpvar_122;
      bool tmpvar_123;
      bool tmpvar_124;
      vec3 tmpvar_125;
      float tmpvar_126;
      Material tmpvar_127;
      if ((tmpvar_17 == 0)) {
        tmpvar_127 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
      } else {
        if ((tmpvar_17 == 1)) {
          tmpvar_127 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_17 == 2)) {
            tmpvar_127 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_17 == 3)) {
              tmpvar_127 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_17 == 4)) {
                tmpvar_127 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_17 == 5)) {
                  tmpvar_127 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_17 == 6)) {
                    tmpvar_127 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_17 == 7)) {
                      tmpvar_127 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_17 == 8)) {
                        tmpvar_127 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                      } else {
                        if ((tmpvar_17 == 9)) {
                          tmpvar_127 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                        } else {
                          if (((tmpvar_17 >= 10) && (tmpvar_17 < 10))) {
                            tmpvar_127 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                          } else {
                            if (((tmpvar_17 == 10) || (tmpvar_17 == 11))) {
                              tmpvar_127 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if ((tmpvar_17 == 12)) {
                                tmpvar_127 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                              } else {
                                if ((tmpvar_17 > 13)) {
                                  tmpvar_127 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  tmpvar_127 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
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
      tmpvar_122 = tmpvar_127.amb;
      tmpvar_123 = tmpvar_127.refractive;
      tmpvar_124 = tmpvar_127.reflective;
      tmpvar_125 = tmpvar_127.f0;
      tmpvar_126 = tmpvar_127.n;
      vec3 tmpvar_128;
      if ((tmpvar_17 == 0)) {
        tmpvar_128 = tmpvar_122;
      } else {
        float diffintensity_129;
        vec3 toLight_130;
        vec3 specular_131;
        vec3 diffuse_132;
        vec3 color_133;
        vec3 refDir_134;
        vec3 I_135;
        I_135 = (tmpvar_19 - ray_1.origin);
        refDir_134 = normalize((I_135 - (2.0 * 
          (dot (tmpvar_12, I_135) * tmpvar_12)
        )));
        vec3 tmpvar_136;
        Material tmpvar_137;
        if ((tmpvar_17 == 0)) {
          tmpvar_137 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_17 == 1)) {
            tmpvar_137 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_17 == 2)) {
              tmpvar_137 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_17 == 3)) {
                tmpvar_137 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_17 == 4)) {
                  tmpvar_137 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_17 == 5)) {
                    tmpvar_137 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_17 == 6)) {
                      tmpvar_137 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_17 == 7)) {
                        tmpvar_137 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_17 == 8)) {
                          tmpvar_137 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_17 == 9)) {
                            tmpvar_137 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_17 >= 10) && (tmpvar_17 < 10))) {
                              tmpvar_137 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_17 == 10) || (tmpvar_17 == 11))) {
                                tmpvar_137 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if ((tmpvar_17 == 12)) {
                                  tmpvar_137 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_17 > 13)) {
                                    tmpvar_137 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_137 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
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
        tmpvar_136 = tmpvar_137.amb;
        color_133 = tmpvar_136;
        diffuse_132 = vec3(0.0, 0.0, 0.0);
        specular_131 = vec3(0.0, 0.0, 0.0);
        vec3 tmpvar_138;
        tmpvar_138 = normalize(-(tmpvar_19));
        toLight_130 = tmpvar_138;
        diffintensity_129 = clamp (dot (tmpvar_12, tmpvar_138), 0.0, 1.0);
        vec3 tmpvar_139;
        Material tmpvar_140;
        if ((tmpvar_17 == 0)) {
          tmpvar_140 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_17 == 1)) {
            tmpvar_140 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_17 == 2)) {
              tmpvar_140 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_17 == 3)) {
                tmpvar_140 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_17 == 4)) {
                  tmpvar_140 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_17 == 5)) {
                    tmpvar_140 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_17 == 6)) {
                      tmpvar_140 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_17 == 7)) {
                        tmpvar_140 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_17 == 8)) {
                          tmpvar_140 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_17 == 9)) {
                            tmpvar_140 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_17 >= 10) && (tmpvar_17 < 10))) {
                              tmpvar_140 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_17 == 10) || (tmpvar_17 == 11))) {
                                tmpvar_140 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if ((tmpvar_17 == 12)) {
                                  tmpvar_140 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_17 > 13)) {
                                    tmpvar_140 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_140 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
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
        tmpvar_139 = tmpvar_140.spec;
        float tmpvar_141;
        tmpvar_141 = clamp (dot (tmpvar_138, refDir_134), 0.0, 1.0);
        Material tmpvar_142;
        if ((tmpvar_17 == 0)) {
          tmpvar_142 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_17 == 1)) {
            tmpvar_142 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_17 == 2)) {
              tmpvar_142 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_17 == 3)) {
                tmpvar_142 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_17 == 4)) {
                  tmpvar_142 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_17 == 5)) {
                    tmpvar_142 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_17 == 6)) {
                      tmpvar_142 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_17 == 7)) {
                        tmpvar_142 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_17 == 8)) {
                          tmpvar_142 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_17 == 9)) {
                            tmpvar_142 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_17 >= 10) && (tmpvar_17 < 10))) {
                              tmpvar_142 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_17 == 10) || (tmpvar_17 == 11))) {
                                tmpvar_142 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if ((tmpvar_17 == 12)) {
                                  tmpvar_142 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_17 > 13)) {
                                    tmpvar_142 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_142 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
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
        specular_131 = clamp ((tmpvar_139 * pow (tmpvar_141, tmpvar_142.pow)), 0.0, 1.0);
        Material tmpvar_143;
        if ((tmpvar_17 == 0)) {
          tmpvar_143 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_17 == 1)) {
            tmpvar_143 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_17 == 2)) {
              tmpvar_143 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_17 == 3)) {
                tmpvar_143 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_17 == 4)) {
                  tmpvar_143 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_17 == 5)) {
                    tmpvar_143 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_17 == 6)) {
                      tmpvar_143 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_17 == 7)) {
                        tmpvar_143 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_17 == 8)) {
                          tmpvar_143 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_17 == 9)) {
                            tmpvar_143 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_17 >= 10) && (tmpvar_17 < 10))) {
                              tmpvar_143 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_17 == 10) || (tmpvar_17 == 11))) {
                                tmpvar_143 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if ((tmpvar_17 == 12)) {
                                  tmpvar_143 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_17 > 13)) {
                                    tmpvar_143 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_143 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
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
        diffuse_132 = clamp ((tmpvar_143.dif * diffintensity_129), 0.0, 1.0);
        if (isShadowOn) {
          vec3 tmpvar_144;
          vec3 tmpvar_145;
          tmpvar_144 = (tmpvar_19 + (tmpvar_12 * 0.001));
          tmpvar_145 = normalize(-(tmpvar_19));
          int tmpvar_146;
          tmpvar_146 = tmpvar_17;
          int i_147;
          float minT_148;
          minT_148 = -1.0;
          i_147 = 0;
          while (true) {
            if ((i_147 >= 10)) {
              break;
            };
            vec4 sphere_149;
            sphere_149 = spheres[i_147];
            int tmpvar_150;
            float tmpvar_151;
            bool tmpvar_152;
            float t_153;
            float t2_154;
            float t1_155;
            vec3 tmpvar_156;
            tmpvar_156 = (tmpvar_144 - sphere_149.xyz);
            float tmpvar_157;
            tmpvar_157 = (dot (tmpvar_156, tmpvar_145) * 2.0);
            float tmpvar_158;
            tmpvar_158 = dot (tmpvar_145, tmpvar_145);
            float tmpvar_159;
            tmpvar_159 = ((tmpvar_157 * tmpvar_157) - ((4.0 * tmpvar_158) * (
              dot (tmpvar_156, tmpvar_156)
             - 
              (sphere_149.w * sphere_149.w)
            )));
            if ((tmpvar_159 < 0.0)) {
              tmpvar_152 = bool(0);
            } else {
              float tmpvar_160;
              tmpvar_160 = sqrt(tmpvar_159);
              float tmpvar_161;
              tmpvar_161 = (((
                -(tmpvar_157)
               + tmpvar_160) / 2.0) / tmpvar_158);
              t1_155 = tmpvar_161;
              float tmpvar_162;
              tmpvar_162 = (((
                -(tmpvar_157)
               - tmpvar_160) / 2.0) / tmpvar_158);
              t2_154 = tmpvar_162;
              if ((tmpvar_161 < 0.001)) {
                t1_155 = -0.001;
              };
              if ((tmpvar_162 < 0.001)) {
                t2_154 = -0.001;
              };
              if ((t1_155 < 0.0)) {
                tmpvar_152 = bool(0);
              } else {
                if ((t2_154 > 0.0)) {
                  t_153 = t2_154;
                } else {
                  t_153 = t1_155;
                };
                tmpvar_150 = i_147;
                tmpvar_151 = t_153;
                tmpvar_152 = bool(1);
              };
            };
            if ((tmpvar_152 && ((tmpvar_151 < minT_148) || (minT_148 < 0.0)))) {
              minT_148 = tmpvar_151;
              tmpvar_146 = tmpvar_150;
            };
            i_147++;
          };
          float tmpvar_163;
          bool tmpvar_164;
          float t1_165;
          float v_166;
          float u_167;
          float invDet_168;
          vec3 T_169;
          vec3 tmpvar_170;
          tmpvar_170 = ((tmpvar_145.yzx * vec3(2.0, 28.0, -19.0)) - (tmpvar_145.zxy * vec3(-19.0, 2.0, 28.0)));
          invDet_168 = (1.0/(dot (vec3(0.0, -19.0, 2.0), tmpvar_170)));
          T_169 = (tmpvar_144 - vec3(-14.0, 14.0, -14.0));
          u_167 = (dot (T_169, tmpvar_170) * invDet_168);
          if (((u_167 < 0.0) || (u_167 > 1.0))) {
            tmpvar_164 = bool(0);
          } else {
            vec3 tmpvar_171;
            tmpvar_171 = ((T_169.yzx * vec3(2.0, 0.0, -19.0)) - (T_169.zxy * vec3(-19.0, 2.0, 0.0)));
            v_166 = (dot (tmpvar_145, tmpvar_171) * invDet_168);
            if (((v_166 < 0.0) || ((u_167 + v_166) > 1.0))) {
              tmpvar_164 = bool(0);
            } else {
              t1_165 = (dot (vec3(28.0, -19.0, 2.0), tmpvar_171) * invDet_168);
              if ((t1_165 > 0.001)) {
                tmpvar_163 = t1_165;
                tmpvar_164 = bool(1);
              } else {
                tmpvar_164 = bool(0);
              };
            };
          };
          if ((tmpvar_164 && ((tmpvar_163 < minT_148) || (minT_148 < 0.0)))) {
            minT_148 = tmpvar_163;
            tmpvar_146 = 10;
          };
          float tmpvar_172;
          bool tmpvar_173;
          float t1_174;
          float v_175;
          float u_176;
          float invDet_177;
          vec3 T_178;
          vec3 tmpvar_179;
          tmpvar_179 = ((tmpvar_145.yzx * vec3(0.0, 28.0, 0.0)) - (tmpvar_145.zxy * vec3(0.0, 0.0, 28.0)));
          invDet_177 = (1.0/(dot (vec3(28.0, -19.0, 2.0), tmpvar_179)));
          T_178 = (tmpvar_144 - vec3(-14.0, 14.0, -14.0));
          u_176 = (dot (T_178, tmpvar_179) * invDet_177);
          if (((u_176 < 0.0) || (u_176 > 1.0))) {
            tmpvar_173 = bool(0);
          } else {
            vec3 tmpvar_180;
            tmpvar_180 = ((T_178.yzx * vec3(2.0, 28.0, -19.0)) - (T_178.zxy * vec3(-19.0, 2.0, 28.0)));
            v_175 = (dot (tmpvar_145, tmpvar_180) * invDet_177);
            if (((v_175 < 0.0) || ((u_176 + v_175) > 1.0))) {
              tmpvar_173 = bool(0);
            } else {
              t1_174 = (dot (vec3(28.0, 0.0, 0.0), tmpvar_180) * invDet_177);
              if ((t1_174 > 0.001)) {
                tmpvar_172 = t1_174;
                tmpvar_173 = bool(1);
              } else {
                tmpvar_173 = bool(0);
              };
            };
          };
          if ((tmpvar_173 && ((tmpvar_172 < minT_148) || (minT_148 < 0.0)))) {
            minT_148 = tmpvar_172;
            tmpvar_146 = 11;
          };
          bool tmpvar_181;
          tmpvar_181 = bool(1);
          bool tmpvar_182;
          float tmpvar_183;
          bool tmpvar_184;
          float tmpvar_185;
          tmpvar_185 = ((vec3(0.0, -10.0, 0.0) - tmpvar_144).y / tmpvar_145.y);
          if ((tmpvar_185 < 0.001)) {
            tmpvar_184 = bool(0);
          } else {
            tmpvar_183 = tmpvar_185;
            tmpvar_184 = bool(1);
          };
          if (tmpvar_184) {
            float tmpvar_186;
            vec3 tmpvar_187;
            tmpvar_187 = ((tmpvar_144 + (tmpvar_183 * tmpvar_145)) - vec3(0.0, -10.0, 0.0));
            tmpvar_186 = sqrt(dot (tmpvar_187, tmpvar_187));
            if ((tmpvar_186 <= 30.0)) {
              tmpvar_182 = bool(1);
              tmpvar_181 = bool(0);
            };
          };
          if (tmpvar_181) {
            tmpvar_182 = bool(0);
            tmpvar_181 = bool(0);
          };
          if ((tmpvar_182 && ((tmpvar_183 < minT_148) || (minT_148 < 0.0)))) {
            minT_148 = tmpvar_183;
            tmpvar_146 = 12;
          };
          float tmpvar_188;
          bool tmpvar_189;
          float tmpvar_190;
          tmpvar_190 = (dot (vec3(0.0, 0.0, -1.0), (vec3(0.0, 0.0, 10000.0) - tmpvar_144)) / dot (vec3(0.0, 0.0, -1.0), tmpvar_145));
          if ((tmpvar_190 < 0.001)) {
            tmpvar_189 = bool(0);
          } else {
            tmpvar_188 = tmpvar_190;
            tmpvar_189 = bool(1);
          };
          if ((tmpvar_189 && ((tmpvar_188 < minT_148) || (minT_148 < 0.0)))) {
            minT_148 = tmpvar_188;
            tmpvar_146 = 14;
          };
          float tmpvar_191;
          bool tmpvar_192;
          float tmpvar_193;
          tmpvar_193 = ((vec3(0.0, -10000.0, 0.0) - tmpvar_144).y / tmpvar_145.y);
          if ((tmpvar_193 < 0.001)) {
            tmpvar_192 = bool(0);
          } else {
            tmpvar_191 = tmpvar_193;
            tmpvar_192 = bool(1);
          };
          if ((tmpvar_192 && ((tmpvar_191 < minT_148) || (minT_148 < 0.0)))) {
            minT_148 = tmpvar_191;
            tmpvar_146 = 15;
          };
          float tmpvar_194;
          bool tmpvar_195;
          float tmpvar_196;
          tmpvar_196 = ((vec3(0.0, 0.0, -10000.0) - tmpvar_144).z / tmpvar_145.z);
          if ((tmpvar_196 < 0.001)) {
            tmpvar_195 = bool(0);
          } else {
            tmpvar_194 = tmpvar_196;
            tmpvar_195 = bool(1);
          };
          if ((tmpvar_195 && ((tmpvar_194 < minT_148) || (minT_148 < 0.0)))) {
            minT_148 = tmpvar_194;
            tmpvar_146 = 16;
          };
          float tmpvar_197;
          bool tmpvar_198;
          float tmpvar_199;
          tmpvar_199 = ((vec3(-10000.0, 0.0, 0.0) - tmpvar_144).x / tmpvar_145.x);
          if ((tmpvar_199 < 0.001)) {
            tmpvar_198 = bool(0);
          } else {
            tmpvar_197 = tmpvar_199;
            tmpvar_198 = bool(1);
          };
          if ((tmpvar_198 && ((tmpvar_197 < minT_148) || (minT_148 < 0.0)))) {
            minT_148 = tmpvar_197;
            tmpvar_146 = 17;
          };
          float tmpvar_200;
          bool tmpvar_201;
          float tmpvar_202;
          tmpvar_202 = (dot (vec3(-1.0, 0.0, 0.0), (vec3(10000.0, 0.0, 0.0) - tmpvar_144)) / dot (vec3(-1.0, 0.0, 0.0), tmpvar_145));
          if ((tmpvar_202 < 0.001)) {
            tmpvar_201 = bool(0);
          } else {
            tmpvar_200 = tmpvar_202;
            tmpvar_201 = bool(1);
          };
          if ((tmpvar_201 && ((tmpvar_200 < minT_148) || (minT_148 < 0.0)))) {
            minT_148 = tmpvar_200;
            tmpvar_146 = 18;
          };
          float tmpvar_203;
          bool tmpvar_204;
          float tmpvar_205;
          tmpvar_205 = (dot (vec3(0.0, -1.0, 0.0), (vec3(0.0, 10000.0, 0.0) - tmpvar_144)) / dot (vec3(0.0, -1.0, 0.0), tmpvar_145));
          if ((tmpvar_205 < 0.001)) {
            tmpvar_204 = bool(0);
          } else {
            tmpvar_203 = tmpvar_205;
            tmpvar_204 = bool(1);
          };
          if ((tmpvar_204 && ((tmpvar_203 < minT_148) || (minT_148 < 0.0)))) {
            minT_148 = tmpvar_203;
            tmpvar_146 = 19;
          };
          if ((((
            (((tmpvar_146 != 0) && (tmpvar_146 != 5)) && (tmpvar_146 != 6))
           && 
            (tmpvar_146 != 12)
          ) && (tmpvar_146 != tmpvar_17)) && (tmpvar_17 <= 12))) {
            specular_131 = vec3(0.0, 0.0, 0.0);
            diffuse_132 = vec3(0.0, 0.0, 0.0);
          };
        };
        color_133 = (tmpvar_136 + (diffuse_132 + specular_131));
        toLight_130 = (vec3(-2.0, 20.0, 0.0) - tmpvar_19);
        vec3 tmpvar_206;
        tmpvar_206 = normalize(toLight_130);
        toLight_130 = tmpvar_206;
        diffintensity_129 = clamp (dot (tmpvar_12, tmpvar_206), 0.0, 1.0);
        vec3 tmpvar_207;
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
                  if ((tmpvar_17 == 5)) {
                    tmpvar_208 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_17 == 6)) {
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
                            if (((tmpvar_17 >= 10) && (tmpvar_17 < 10))) {
                              tmpvar_208 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_17 == 10) || (tmpvar_17 == 11))) {
                                tmpvar_208 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if ((tmpvar_17 == 12)) {
                                  tmpvar_208 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_17 > 13)) {
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
        tmpvar_207 = tmpvar_208.spec;
        float tmpvar_209;
        tmpvar_209 = clamp (dot (tmpvar_206, refDir_134), 0.0, 1.0);
        Material tmpvar_210;
        if ((tmpvar_17 == 0)) {
          tmpvar_210 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_17 == 1)) {
            tmpvar_210 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_17 == 2)) {
              tmpvar_210 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_17 == 3)) {
                tmpvar_210 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_17 == 4)) {
                  tmpvar_210 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_17 == 5)) {
                    tmpvar_210 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_17 == 6)) {
                      tmpvar_210 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_17 == 7)) {
                        tmpvar_210 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_17 == 8)) {
                          tmpvar_210 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_17 == 9)) {
                            tmpvar_210 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_17 >= 10) && (tmpvar_17 < 10))) {
                              tmpvar_210 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_17 == 10) || (tmpvar_17 == 11))) {
                                tmpvar_210 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if ((tmpvar_17 == 12)) {
                                  tmpvar_210 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_17 > 13)) {
                                    tmpvar_210 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_210 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
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
        specular_131 = clamp ((tmpvar_207 * pow (tmpvar_209, tmpvar_210.pow)), 0.0, 1.0);
        Material tmpvar_211;
        if ((tmpvar_17 == 0)) {
          tmpvar_211 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_17 == 1)) {
            tmpvar_211 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_17 == 2)) {
              tmpvar_211 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_17 == 3)) {
                tmpvar_211 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_17 == 4)) {
                  tmpvar_211 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_17 == 5)) {
                    tmpvar_211 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_17 == 6)) {
                      tmpvar_211 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_17 == 7)) {
                        tmpvar_211 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_17 == 8)) {
                          tmpvar_211 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_17 == 9)) {
                            tmpvar_211 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_17 >= 10) && (tmpvar_17 < 10))) {
                              tmpvar_211 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_17 == 10) || (tmpvar_17 == 11))) {
                                tmpvar_211 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if ((tmpvar_17 == 12)) {
                                  tmpvar_211 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_17 > 13)) {
                                    tmpvar_211 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_211 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
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
        diffuse_132 = clamp ((tmpvar_211.dif * diffintensity_129), 0.0, 1.0);
        if (isShadowOn) {
          vec3 tmpvar_212;
          vec3 tmpvar_213;
          tmpvar_212 = (tmpvar_19 + (tmpvar_12 * 0.001));
          tmpvar_213 = normalize((vec3(-2.0, 20.0, 0.0) - tmpvar_19));
          int tmpvar_214;
          tmpvar_214 = tmpvar_17;
          int i_215;
          float minT_216;
          minT_216 = -1.0;
          i_215 = 0;
          while (true) {
            if ((i_215 >= 10)) {
              break;
            };
            vec4 sphere_217;
            sphere_217 = spheres[i_215];
            int tmpvar_218;
            float tmpvar_219;
            bool tmpvar_220;
            float t_221;
            float t2_222;
            float t1_223;
            vec3 tmpvar_224;
            tmpvar_224 = (tmpvar_212 - sphere_217.xyz);
            float tmpvar_225;
            tmpvar_225 = (dot (tmpvar_224, tmpvar_213) * 2.0);
            float tmpvar_226;
            tmpvar_226 = dot (tmpvar_213, tmpvar_213);
            float tmpvar_227;
            tmpvar_227 = ((tmpvar_225 * tmpvar_225) - ((4.0 * tmpvar_226) * (
              dot (tmpvar_224, tmpvar_224)
             - 
              (sphere_217.w * sphere_217.w)
            )));
            if ((tmpvar_227 < 0.0)) {
              tmpvar_220 = bool(0);
            } else {
              float tmpvar_228;
              tmpvar_228 = sqrt(tmpvar_227);
              float tmpvar_229;
              tmpvar_229 = (((
                -(tmpvar_225)
               + tmpvar_228) / 2.0) / tmpvar_226);
              t1_223 = tmpvar_229;
              float tmpvar_230;
              tmpvar_230 = (((
                -(tmpvar_225)
               - tmpvar_228) / 2.0) / tmpvar_226);
              t2_222 = tmpvar_230;
              if ((tmpvar_229 < 0.001)) {
                t1_223 = -0.001;
              };
              if ((tmpvar_230 < 0.001)) {
                t2_222 = -0.001;
              };
              if ((t1_223 < 0.0)) {
                tmpvar_220 = bool(0);
              } else {
                if ((t2_222 > 0.0)) {
                  t_221 = t2_222;
                } else {
                  t_221 = t1_223;
                };
                tmpvar_218 = i_215;
                tmpvar_219 = t_221;
                tmpvar_220 = bool(1);
              };
            };
            if ((tmpvar_220 && ((tmpvar_219 < minT_216) || (minT_216 < 0.0)))) {
              minT_216 = tmpvar_219;
              tmpvar_214 = tmpvar_218;
            };
            i_215++;
          };
          float tmpvar_231;
          bool tmpvar_232;
          float t1_233;
          float v_234;
          float u_235;
          float invDet_236;
          vec3 T_237;
          vec3 tmpvar_238;
          tmpvar_238 = ((tmpvar_213.yzx * vec3(2.0, 28.0, -19.0)) - (tmpvar_213.zxy * vec3(-19.0, 2.0, 28.0)));
          invDet_236 = (1.0/(dot (vec3(0.0, -19.0, 2.0), tmpvar_238)));
          T_237 = (tmpvar_212 - vec3(-14.0, 14.0, -14.0));
          u_235 = (dot (T_237, tmpvar_238) * invDet_236);
          if (((u_235 < 0.0) || (u_235 > 1.0))) {
            tmpvar_232 = bool(0);
          } else {
            vec3 tmpvar_239;
            tmpvar_239 = ((T_237.yzx * vec3(2.0, 0.0, -19.0)) - (T_237.zxy * vec3(-19.0, 2.0, 0.0)));
            v_234 = (dot (tmpvar_213, tmpvar_239) * invDet_236);
            if (((v_234 < 0.0) || ((u_235 + v_234) > 1.0))) {
              tmpvar_232 = bool(0);
            } else {
              t1_233 = (dot (vec3(28.0, -19.0, 2.0), tmpvar_239) * invDet_236);
              if ((t1_233 > 0.001)) {
                tmpvar_231 = t1_233;
                tmpvar_232 = bool(1);
              } else {
                tmpvar_232 = bool(0);
              };
            };
          };
          if ((tmpvar_232 && ((tmpvar_231 < minT_216) || (minT_216 < 0.0)))) {
            minT_216 = tmpvar_231;
            tmpvar_214 = 10;
          };
          float tmpvar_240;
          bool tmpvar_241;
          float t1_242;
          float v_243;
          float u_244;
          float invDet_245;
          vec3 T_246;
          vec3 tmpvar_247;
          tmpvar_247 = ((tmpvar_213.yzx * vec3(0.0, 28.0, 0.0)) - (tmpvar_213.zxy * vec3(0.0, 0.0, 28.0)));
          invDet_245 = (1.0/(dot (vec3(28.0, -19.0, 2.0), tmpvar_247)));
          T_246 = (tmpvar_212 - vec3(-14.0, 14.0, -14.0));
          u_244 = (dot (T_246, tmpvar_247) * invDet_245);
          if (((u_244 < 0.0) || (u_244 > 1.0))) {
            tmpvar_241 = bool(0);
          } else {
            vec3 tmpvar_248;
            tmpvar_248 = ((T_246.yzx * vec3(2.0, 28.0, -19.0)) - (T_246.zxy * vec3(-19.0, 2.0, 28.0)));
            v_243 = (dot (tmpvar_213, tmpvar_248) * invDet_245);
            if (((v_243 < 0.0) || ((u_244 + v_243) > 1.0))) {
              tmpvar_241 = bool(0);
            } else {
              t1_242 = (dot (vec3(28.0, 0.0, 0.0), tmpvar_248) * invDet_245);
              if ((t1_242 > 0.001)) {
                tmpvar_240 = t1_242;
                tmpvar_241 = bool(1);
              } else {
                tmpvar_241 = bool(0);
              };
            };
          };
          if ((tmpvar_241 && ((tmpvar_240 < minT_216) || (minT_216 < 0.0)))) {
            minT_216 = tmpvar_240;
            tmpvar_214 = 11;
          };
          bool tmpvar_249;
          tmpvar_249 = bool(1);
          bool tmpvar_250;
          float tmpvar_251;
          bool tmpvar_252;
          float tmpvar_253;
          tmpvar_253 = ((vec3(0.0, -10.0, 0.0) - tmpvar_212).y / tmpvar_213.y);
          if ((tmpvar_253 < 0.001)) {
            tmpvar_252 = bool(0);
          } else {
            tmpvar_251 = tmpvar_253;
            tmpvar_252 = bool(1);
          };
          if (tmpvar_252) {
            float tmpvar_254;
            vec3 tmpvar_255;
            tmpvar_255 = ((tmpvar_212 + (tmpvar_251 * tmpvar_213)) - vec3(0.0, -10.0, 0.0));
            tmpvar_254 = sqrt(dot (tmpvar_255, tmpvar_255));
            if ((tmpvar_254 <= 30.0)) {
              tmpvar_250 = bool(1);
              tmpvar_249 = bool(0);
            };
          };
          if (tmpvar_249) {
            tmpvar_250 = bool(0);
            tmpvar_249 = bool(0);
          };
          if ((tmpvar_250 && ((tmpvar_251 < minT_216) || (minT_216 < 0.0)))) {
            minT_216 = tmpvar_251;
            tmpvar_214 = 12;
          };
          float tmpvar_256;
          bool tmpvar_257;
          float tmpvar_258;
          tmpvar_258 = (dot (vec3(0.0, 0.0, -1.0), (vec3(0.0, 0.0, 10000.0) - tmpvar_212)) / dot (vec3(0.0, 0.0, -1.0), tmpvar_213));
          if ((tmpvar_258 < 0.001)) {
            tmpvar_257 = bool(0);
          } else {
            tmpvar_256 = tmpvar_258;
            tmpvar_257 = bool(1);
          };
          if ((tmpvar_257 && ((tmpvar_256 < minT_216) || (minT_216 < 0.0)))) {
            minT_216 = tmpvar_256;
            tmpvar_214 = 14;
          };
          float tmpvar_259;
          bool tmpvar_260;
          float tmpvar_261;
          tmpvar_261 = ((vec3(0.0, -10000.0, 0.0) - tmpvar_212).y / tmpvar_213.y);
          if ((tmpvar_261 < 0.001)) {
            tmpvar_260 = bool(0);
          } else {
            tmpvar_259 = tmpvar_261;
            tmpvar_260 = bool(1);
          };
          if ((tmpvar_260 && ((tmpvar_259 < minT_216) || (minT_216 < 0.0)))) {
            minT_216 = tmpvar_259;
            tmpvar_214 = 15;
          };
          float tmpvar_262;
          bool tmpvar_263;
          float tmpvar_264;
          tmpvar_264 = ((vec3(0.0, 0.0, -10000.0) - tmpvar_212).z / tmpvar_213.z);
          if ((tmpvar_264 < 0.001)) {
            tmpvar_263 = bool(0);
          } else {
            tmpvar_262 = tmpvar_264;
            tmpvar_263 = bool(1);
          };
          if ((tmpvar_263 && ((tmpvar_262 < minT_216) || (minT_216 < 0.0)))) {
            minT_216 = tmpvar_262;
            tmpvar_214 = 16;
          };
          float tmpvar_265;
          bool tmpvar_266;
          float tmpvar_267;
          tmpvar_267 = ((vec3(-10000.0, 0.0, 0.0) - tmpvar_212).x / tmpvar_213.x);
          if ((tmpvar_267 < 0.001)) {
            tmpvar_266 = bool(0);
          } else {
            tmpvar_265 = tmpvar_267;
            tmpvar_266 = bool(1);
          };
          if ((tmpvar_266 && ((tmpvar_265 < minT_216) || (minT_216 < 0.0)))) {
            minT_216 = tmpvar_265;
            tmpvar_214 = 17;
          };
          float tmpvar_268;
          bool tmpvar_269;
          float tmpvar_270;
          tmpvar_270 = (dot (vec3(-1.0, 0.0, 0.0), (vec3(10000.0, 0.0, 0.0) - tmpvar_212)) / dot (vec3(-1.0, 0.0, 0.0), tmpvar_213));
          if ((tmpvar_270 < 0.001)) {
            tmpvar_269 = bool(0);
          } else {
            tmpvar_268 = tmpvar_270;
            tmpvar_269 = bool(1);
          };
          if ((tmpvar_269 && ((tmpvar_268 < minT_216) || (minT_216 < 0.0)))) {
            minT_216 = tmpvar_268;
            tmpvar_214 = 18;
          };
          float tmpvar_271;
          bool tmpvar_272;
          float tmpvar_273;
          tmpvar_273 = (dot (vec3(0.0, -1.0, 0.0), (vec3(0.0, 10000.0, 0.0) - tmpvar_212)) / dot (vec3(0.0, -1.0, 0.0), tmpvar_213));
          if ((tmpvar_273 < 0.001)) {
            tmpvar_272 = bool(0);
          } else {
            tmpvar_271 = tmpvar_273;
            tmpvar_272 = bool(1);
          };
          if ((tmpvar_272 && ((tmpvar_271 < minT_216) || (minT_216 < 0.0)))) {
            minT_216 = tmpvar_271;
            tmpvar_214 = 19;
          };
          if ((((
            (((tmpvar_214 != 0) && (tmpvar_214 != 5)) && (tmpvar_214 != 6))
           && 
            (tmpvar_214 != 12)
          ) && (tmpvar_214 != tmpvar_17)) && (tmpvar_17 <= 12))) {
            specular_131 = vec3(0.0, 0.0, 0.0);
            diffuse_132 = vec3(0.0, 0.0, 0.0);
          };
        };
        color_133 = (color_133 + (diffuse_132 + specular_131));
        toLight_130 = (vec3(20.0, 20.0, 0.0) - tmpvar_19);
        vec3 tmpvar_274;
        tmpvar_274 = normalize(toLight_130);
        toLight_130 = tmpvar_274;
        diffintensity_129 = clamp (dot (tmpvar_12, tmpvar_274), 0.0, 1.0);
        vec3 tmpvar_275;
        Material tmpvar_276;
        if ((tmpvar_17 == 0)) {
          tmpvar_276 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_17 == 1)) {
            tmpvar_276 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_17 == 2)) {
              tmpvar_276 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_17 == 3)) {
                tmpvar_276 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_17 == 4)) {
                  tmpvar_276 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_17 == 5)) {
                    tmpvar_276 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_17 == 6)) {
                      tmpvar_276 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_17 == 7)) {
                        tmpvar_276 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_17 == 8)) {
                          tmpvar_276 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_17 == 9)) {
                            tmpvar_276 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_17 >= 10) && (tmpvar_17 < 10))) {
                              tmpvar_276 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_17 == 10) || (tmpvar_17 == 11))) {
                                tmpvar_276 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if ((tmpvar_17 == 12)) {
                                  tmpvar_276 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_17 > 13)) {
                                    tmpvar_276 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_276 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
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
        tmpvar_275 = tmpvar_276.spec;
        float tmpvar_277;
        tmpvar_277 = clamp (dot (tmpvar_274, refDir_134), 0.0, 1.0);
        Material tmpvar_278;
        if ((tmpvar_17 == 0)) {
          tmpvar_278 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_17 == 1)) {
            tmpvar_278 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_17 == 2)) {
              tmpvar_278 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_17 == 3)) {
                tmpvar_278 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_17 == 4)) {
                  tmpvar_278 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_17 == 5)) {
                    tmpvar_278 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_17 == 6)) {
                      tmpvar_278 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_17 == 7)) {
                        tmpvar_278 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_17 == 8)) {
                          tmpvar_278 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_17 == 9)) {
                            tmpvar_278 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_17 >= 10) && (tmpvar_17 < 10))) {
                              tmpvar_278 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_17 == 10) || (tmpvar_17 == 11))) {
                                tmpvar_278 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if ((tmpvar_17 == 12)) {
                                  tmpvar_278 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_17 > 13)) {
                                    tmpvar_278 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_278 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
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
        specular_131 = clamp ((tmpvar_275 * pow (tmpvar_277, tmpvar_278.pow)), 0.0, 1.0);
        Material tmpvar_279;
        if ((tmpvar_17 == 0)) {
          tmpvar_279 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_17 == 1)) {
            tmpvar_279 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_17 == 2)) {
              tmpvar_279 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_17 == 3)) {
                tmpvar_279 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_17 == 4)) {
                  tmpvar_279 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_17 == 5)) {
                    tmpvar_279 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_17 == 6)) {
                      tmpvar_279 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_17 == 7)) {
                        tmpvar_279 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_17 == 8)) {
                          tmpvar_279 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_17 == 9)) {
                            tmpvar_279 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_17 >= 10) && (tmpvar_17 < 10))) {
                              tmpvar_279 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_17 == 10) || (tmpvar_17 == 11))) {
                                tmpvar_279 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if ((tmpvar_17 == 12)) {
                                  tmpvar_279 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_17 > 13)) {
                                    tmpvar_279 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_279 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
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
        diffuse_132 = clamp ((tmpvar_279.dif * diffintensity_129), 0.0, 1.0);
        if (isShadowOn) {
          vec3 tmpvar_280;
          vec3 tmpvar_281;
          tmpvar_280 = (tmpvar_19 + (tmpvar_12 * 0.001));
          tmpvar_281 = normalize((vec3(20.0, 20.0, 0.0) - tmpvar_19));
          int tmpvar_282;
          tmpvar_282 = tmpvar_17;
          int i_283;
          float minT_284;
          minT_284 = -1.0;
          i_283 = 0;
          while (true) {
            if ((i_283 >= 10)) {
              break;
            };
            vec4 sphere_285;
            sphere_285 = spheres[i_283];
            int tmpvar_286;
            float tmpvar_287;
            bool tmpvar_288;
            float t_289;
            float t2_290;
            float t1_291;
            vec3 tmpvar_292;
            tmpvar_292 = (tmpvar_280 - sphere_285.xyz);
            float tmpvar_293;
            tmpvar_293 = (dot (tmpvar_292, tmpvar_281) * 2.0);
            float tmpvar_294;
            tmpvar_294 = dot (tmpvar_281, tmpvar_281);
            float tmpvar_295;
            tmpvar_295 = ((tmpvar_293 * tmpvar_293) - ((4.0 * tmpvar_294) * (
              dot (tmpvar_292, tmpvar_292)
             - 
              (sphere_285.w * sphere_285.w)
            )));
            if ((tmpvar_295 < 0.0)) {
              tmpvar_288 = bool(0);
            } else {
              float tmpvar_296;
              tmpvar_296 = sqrt(tmpvar_295);
              float tmpvar_297;
              tmpvar_297 = (((
                -(tmpvar_293)
               + tmpvar_296) / 2.0) / tmpvar_294);
              t1_291 = tmpvar_297;
              float tmpvar_298;
              tmpvar_298 = (((
                -(tmpvar_293)
               - tmpvar_296) / 2.0) / tmpvar_294);
              t2_290 = tmpvar_298;
              if ((tmpvar_297 < 0.001)) {
                t1_291 = -0.001;
              };
              if ((tmpvar_298 < 0.001)) {
                t2_290 = -0.001;
              };
              if ((t1_291 < 0.0)) {
                tmpvar_288 = bool(0);
              } else {
                if ((t2_290 > 0.0)) {
                  t_289 = t2_290;
                } else {
                  t_289 = t1_291;
                };
                tmpvar_286 = i_283;
                tmpvar_287 = t_289;
                tmpvar_288 = bool(1);
              };
            };
            if ((tmpvar_288 && ((tmpvar_287 < minT_284) || (minT_284 < 0.0)))) {
              minT_284 = tmpvar_287;
              tmpvar_282 = tmpvar_286;
            };
            i_283++;
          };
          float tmpvar_299;
          bool tmpvar_300;
          float t1_301;
          float v_302;
          float u_303;
          float invDet_304;
          vec3 T_305;
          vec3 tmpvar_306;
          tmpvar_306 = ((tmpvar_281.yzx * vec3(2.0, 28.0, -19.0)) - (tmpvar_281.zxy * vec3(-19.0, 2.0, 28.0)));
          invDet_304 = (1.0/(dot (vec3(0.0, -19.0, 2.0), tmpvar_306)));
          T_305 = (tmpvar_280 - vec3(-14.0, 14.0, -14.0));
          u_303 = (dot (T_305, tmpvar_306) * invDet_304);
          if (((u_303 < 0.0) || (u_303 > 1.0))) {
            tmpvar_300 = bool(0);
          } else {
            vec3 tmpvar_307;
            tmpvar_307 = ((T_305.yzx * vec3(2.0, 0.0, -19.0)) - (T_305.zxy * vec3(-19.0, 2.0, 0.0)));
            v_302 = (dot (tmpvar_281, tmpvar_307) * invDet_304);
            if (((v_302 < 0.0) || ((u_303 + v_302) > 1.0))) {
              tmpvar_300 = bool(0);
            } else {
              t1_301 = (dot (vec3(28.0, -19.0, 2.0), tmpvar_307) * invDet_304);
              if ((t1_301 > 0.001)) {
                tmpvar_299 = t1_301;
                tmpvar_300 = bool(1);
              } else {
                tmpvar_300 = bool(0);
              };
            };
          };
          if ((tmpvar_300 && ((tmpvar_299 < minT_284) || (minT_284 < 0.0)))) {
            minT_284 = tmpvar_299;
            tmpvar_282 = 10;
          };
          float tmpvar_308;
          bool tmpvar_309;
          float t1_310;
          float v_311;
          float u_312;
          float invDet_313;
          vec3 T_314;
          vec3 tmpvar_315;
          tmpvar_315 = ((tmpvar_281.yzx * vec3(0.0, 28.0, 0.0)) - (tmpvar_281.zxy * vec3(0.0, 0.0, 28.0)));
          invDet_313 = (1.0/(dot (vec3(28.0, -19.0, 2.0), tmpvar_315)));
          T_314 = (tmpvar_280 - vec3(-14.0, 14.0, -14.0));
          u_312 = (dot (T_314, tmpvar_315) * invDet_313);
          if (((u_312 < 0.0) || (u_312 > 1.0))) {
            tmpvar_309 = bool(0);
          } else {
            vec3 tmpvar_316;
            tmpvar_316 = ((T_314.yzx * vec3(2.0, 28.0, -19.0)) - (T_314.zxy * vec3(-19.0, 2.0, 28.0)));
            v_311 = (dot (tmpvar_281, tmpvar_316) * invDet_313);
            if (((v_311 < 0.0) || ((u_312 + v_311) > 1.0))) {
              tmpvar_309 = bool(0);
            } else {
              t1_310 = (dot (vec3(28.0, 0.0, 0.0), tmpvar_316) * invDet_313);
              if ((t1_310 > 0.001)) {
                tmpvar_308 = t1_310;
                tmpvar_309 = bool(1);
              } else {
                tmpvar_309 = bool(0);
              };
            };
          };
          if ((tmpvar_309 && ((tmpvar_308 < minT_284) || (minT_284 < 0.0)))) {
            minT_284 = tmpvar_308;
            tmpvar_282 = 11;
          };
          bool tmpvar_317;
          tmpvar_317 = bool(1);
          bool tmpvar_318;
          float tmpvar_319;
          bool tmpvar_320;
          float tmpvar_321;
          tmpvar_321 = ((vec3(0.0, -10.0, 0.0) - tmpvar_280).y / tmpvar_281.y);
          if ((tmpvar_321 < 0.001)) {
            tmpvar_320 = bool(0);
          } else {
            tmpvar_319 = tmpvar_321;
            tmpvar_320 = bool(1);
          };
          if (tmpvar_320) {
            float tmpvar_322;
            vec3 tmpvar_323;
            tmpvar_323 = ((tmpvar_280 + (tmpvar_319 * tmpvar_281)) - vec3(0.0, -10.0, 0.0));
            tmpvar_322 = sqrt(dot (tmpvar_323, tmpvar_323));
            if ((tmpvar_322 <= 30.0)) {
              tmpvar_318 = bool(1);
              tmpvar_317 = bool(0);
            };
          };
          if (tmpvar_317) {
            tmpvar_318 = bool(0);
            tmpvar_317 = bool(0);
          };
          if ((tmpvar_318 && ((tmpvar_319 < minT_284) || (minT_284 < 0.0)))) {
            minT_284 = tmpvar_319;
            tmpvar_282 = 12;
          };
          float tmpvar_324;
          bool tmpvar_325;
          float tmpvar_326;
          tmpvar_326 = (dot (vec3(0.0, 0.0, -1.0), (vec3(0.0, 0.0, 10000.0) - tmpvar_280)) / dot (vec3(0.0, 0.0, -1.0), tmpvar_281));
          if ((tmpvar_326 < 0.001)) {
            tmpvar_325 = bool(0);
          } else {
            tmpvar_324 = tmpvar_326;
            tmpvar_325 = bool(1);
          };
          if ((tmpvar_325 && ((tmpvar_324 < minT_284) || (minT_284 < 0.0)))) {
            minT_284 = tmpvar_324;
            tmpvar_282 = 14;
          };
          float tmpvar_327;
          bool tmpvar_328;
          float tmpvar_329;
          tmpvar_329 = ((vec3(0.0, -10000.0, 0.0) - tmpvar_280).y / tmpvar_281.y);
          if ((tmpvar_329 < 0.001)) {
            tmpvar_328 = bool(0);
          } else {
            tmpvar_327 = tmpvar_329;
            tmpvar_328 = bool(1);
          };
          if ((tmpvar_328 && ((tmpvar_327 < minT_284) || (minT_284 < 0.0)))) {
            minT_284 = tmpvar_327;
            tmpvar_282 = 15;
          };
          float tmpvar_330;
          bool tmpvar_331;
          float tmpvar_332;
          tmpvar_332 = ((vec3(0.0, 0.0, -10000.0) - tmpvar_280).z / tmpvar_281.z);
          if ((tmpvar_332 < 0.001)) {
            tmpvar_331 = bool(0);
          } else {
            tmpvar_330 = tmpvar_332;
            tmpvar_331 = bool(1);
          };
          if ((tmpvar_331 && ((tmpvar_330 < minT_284) || (minT_284 < 0.0)))) {
            minT_284 = tmpvar_330;
            tmpvar_282 = 16;
          };
          float tmpvar_333;
          bool tmpvar_334;
          float tmpvar_335;
          tmpvar_335 = ((vec3(-10000.0, 0.0, 0.0) - tmpvar_280).x / tmpvar_281.x);
          if ((tmpvar_335 < 0.001)) {
            tmpvar_334 = bool(0);
          } else {
            tmpvar_333 = tmpvar_335;
            tmpvar_334 = bool(1);
          };
          if ((tmpvar_334 && ((tmpvar_333 < minT_284) || (minT_284 < 0.0)))) {
            minT_284 = tmpvar_333;
            tmpvar_282 = 17;
          };
          float tmpvar_336;
          bool tmpvar_337;
          float tmpvar_338;
          tmpvar_338 = (dot (vec3(-1.0, 0.0, 0.0), (vec3(10000.0, 0.0, 0.0) - tmpvar_280)) / dot (vec3(-1.0, 0.0, 0.0), tmpvar_281));
          if ((tmpvar_338 < 0.001)) {
            tmpvar_337 = bool(0);
          } else {
            tmpvar_336 = tmpvar_338;
            tmpvar_337 = bool(1);
          };
          if ((tmpvar_337 && ((tmpvar_336 < minT_284) || (minT_284 < 0.0)))) {
            minT_284 = tmpvar_336;
            tmpvar_282 = 18;
          };
          float tmpvar_339;
          bool tmpvar_340;
          float tmpvar_341;
          tmpvar_341 = (dot (vec3(0.0, -1.0, 0.0), (vec3(0.0, 10000.0, 0.0) - tmpvar_280)) / dot (vec3(0.0, -1.0, 0.0), tmpvar_281));
          if ((tmpvar_341 < 0.001)) {
            tmpvar_340 = bool(0);
          } else {
            tmpvar_339 = tmpvar_341;
            tmpvar_340 = bool(1);
          };
          if ((tmpvar_340 && ((tmpvar_339 < minT_284) || (minT_284 < 0.0)))) {
            minT_284 = tmpvar_339;
            tmpvar_282 = 19;
          };
          if ((((
            (((tmpvar_282 != 0) && (tmpvar_282 != 5)) && (tmpvar_282 != 6))
           && 
            (tmpvar_282 != 12)
          ) && (tmpvar_282 != tmpvar_17)) && (tmpvar_17 <= 12))) {
            specular_131 = vec3(0.0, 0.0, 0.0);
            diffuse_132 = vec3(0.0, 0.0, 0.0);
          };
        };
        color_133 = (color_133 + (diffuse_132 + specular_131));
        tmpvar_128 = color_133;
      };
      color_14 = (color_14 + (tmpvar_128 * coeff_3));
      if ((tmpvar_17 == 0)) {
        float tmpvar_342;
        tmpvar_342 = (time / 5.0);
        u_8 = (u_8 + tmpvar_342);
        v_7 = (v_7 + tmpvar_342);
        vec2 tmpvar_343;
        tmpvar_343.x = u_8;
        tmpvar_343.y = v_7;
        color_14 = (color_14 * (texture2D (sunTexture, tmpvar_343).xyz + vec3(0.0, 0.0, 0.5)));
      } else {
        if ((tmpvar_17 == 3)) {
          if (!(useNormalMap)) {
            u_8 = (u_8 + (time / 2.0));
          };
          vec2 tmpvar_344;
          tmpvar_344.x = u_8;
          tmpvar_344.y = v_7;
          color_14 = (color_14 * texture2D (earthTexture, tmpvar_344).xyz);
        } else {
          if ((tmpvar_17 == 4)) {
            if (!(useNormalMap)) {
              u_8 = (u_8 + (time / 7.0));
            };
            vec2 tmpvar_345;
            tmpvar_345.x = u_8;
            tmpvar_345.y = v_7;
            color_14 = (color_14 * texture2D (moonTexture, tmpvar_345).xyz);
          } else {
            if ((tmpvar_17 == 12)) {
              color_14 = (color_14 * texture2D (groundTexture, (0.15 * tmpvar_19.xz)).xyz);
            } else {
              if ((tmpvar_17 == 14)) {
                color_14 = (color_14 * texture2D (skyboxTextureBack, ((
                  -(tmpvar_19.xy)
                 + vec2(10000.0, 10000.0)) / 20000.0)).xyz);
              } else {
                if ((tmpvar_17 == 15)) {
                  color_14 = (color_14 * texture2D (skyboxTextureDown, ((tmpvar_19.xz + vec2(10000.0, 10000.0)) / 20000.0)).xyz);
                } else {
                  if ((tmpvar_17 == 16)) {
                    color_14 = (color_14 * texture2D (skyboxTextureFront, ((
                      (tmpvar_19.xy * vec2(1.0, -1.0))
                     + vec2(10000.0, 10000.0)) / 20000.0)).xyz);
                  } else {
                    if ((tmpvar_17 == 17)) {
                      color_14 = (color_14 * texture2D (skyboxTextureLeft, ((tmpvar_19.yz + vec2(10000.0, 10000.0)) / 20000.0)).xyz);
                    } else {
                      if ((tmpvar_17 == 18)) {
                        color_14 = (color_14 * texture2D (skyboxTextureRight, ((
                          (tmpvar_19.zy * vec2(1.0, -1.0))
                         + vec2(10000.0, 10000.0)) / 20000.0)).xyz);
                      } else {
                        if ((tmpvar_17 == 19)) {
                          color_14 = (color_14 * texture2D (skyboxTextureUp, ((tmpvar_19.xz + vec2(10000.0, 10000.0)) / 20000.0)).xyz);
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
      bool tmpvar_346;
      tmpvar_346 = (((tmpvar_17 == 3) && (color_14.z > color_14.x)) && (color_14.z > color_14.y));
      if ((((tmpvar_124 || tmpvar_123) || tmpvar_346) && (bounceCount_4 <= depth))) {
        bool totalInternalReflection_347;
        totalInternalReflection_347 = bool(0);
        if (tmpvar_123) {
          Ray refractedRay_348;
          float tmpvar_349;
          tmpvar_349 = (1.0/(tmpvar_126));
          float tmpvar_350;
          tmpvar_350 = dot (ray_1.dir, tmpvar_12);
          vec3 tmpvar_351;
          if ((tmpvar_350 <= 0.0)) {
            vec3 I_352;
            I_352 = ray_1.dir;
            vec3 tmpvar_353;
            float tmpvar_354;
            tmpvar_354 = dot (tmpvar_12, I_352);
            float tmpvar_355;
            tmpvar_355 = (1.0 - (tmpvar_349 * (tmpvar_349 * 
              (1.0 - (tmpvar_354 * tmpvar_354))
            )));
            if ((tmpvar_355 < 0.0)) {
              tmpvar_353 = vec3(0.0, 0.0, 0.0);
            } else {
              tmpvar_353 = ((tmpvar_349 * I_352) - ((
                (tmpvar_349 * tmpvar_354)
               + 
                sqrt(tmpvar_355)
              ) * tmpvar_12));
            };
            tmpvar_351 = tmpvar_353;
          } else {
            vec3 I_356;
            I_356 = ray_1.dir;
            vec3 N_357;
            N_357 = -(tmpvar_12);
            float eta_358;
            eta_358 = (1.0/(tmpvar_349));
            vec3 tmpvar_359;
            float tmpvar_360;
            tmpvar_360 = dot (N_357, I_356);
            float tmpvar_361;
            tmpvar_361 = (1.0 - (eta_358 * (eta_358 * 
              (1.0 - (tmpvar_360 * tmpvar_360))
            )));
            if ((tmpvar_361 < 0.0)) {
              tmpvar_359 = vec3(0.0, 0.0, 0.0);
            } else {
              tmpvar_359 = ((eta_358 * I_356) - ((
                (eta_358 * tmpvar_360)
               + 
                sqrt(tmpvar_361)
              ) * N_357));
            };
            tmpvar_351 = tmpvar_359;
          };
          refractedRay_348.dir = tmpvar_351;
          vec3 x_362;
          x_362 = refractedRay_348.dir;
          totalInternalReflection_347 = (sqrt(dot (x_362, x_362)) < 0.001);
          if (totalInternalReflection_347) {
            vec3 I_363;
            I_363 = ray_1.dir;
            vec3 N_364;
            N_364 = -(tmpvar_12);
            ray_1.dir = normalize((I_363 - (2.0 * 
              (dot (N_364, I_363) * N_364)
            )));
            ray_1.origin = (tmpvar_19 - (tmpvar_12 * 0.001));
          } else {
            refractedRay_348.origin = (tmpvar_19 + ((tmpvar_12 * 0.001) * sign(
              dot (ray_1.dir, tmpvar_12)
            )));
            refractedRay_348.dir = normalize(refractedRay_348.dir);
            if (!(tmpvar_124)) {
              ray_1 = refractedRay_348;
            } else {
              stack_6[stackSize_5].coeff = (coeff_3 * (vec3(1.0, 1.0, 1.0) - (tmpvar_125 + 
                ((vec3(1.0, 1.0, 1.0) - tmpvar_125) * pow ((1.0 - abs(
                  dot (tmpvar_12, ray_1.dir)
                )), 5.0))
              )));
              stack_6[stackSize_5].depth = bounceCount_4;
              int tmpvar_365;
              tmpvar_365 = stackSize_5;
              stackSize_5++;
              stack_6[tmpvar_365].ray = refractedRay_348;
            };
          };
        };
        if ((((tmpvar_124 && 
          !(totalInternalReflection_347)
        ) && (tmpvar_17 != 3)) || tmpvar_346)) {
          float tmpvar_366;
          tmpvar_366 = dot (ray_1.dir, tmpvar_12);
          if ((tmpvar_366 < 0.0)) {
            coeff_3 = (coeff_3 * (tmpvar_125 + (
              (vec3(1.0, 1.0, 1.0) - tmpvar_125)
             * 
              pow ((1.0 - abs(dot (tmpvar_12, ray_1.dir))), 5.0)
            )));
            vec3 I_367;
            I_367 = ray_1.dir;
            ray_1.dir = normalize((I_367 - (2.0 * 
              (dot (tmpvar_12, I_367) * tmpvar_12)
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
      vec3 glowness_368;
      vec3 tmpvar_369;
      tmpvar_369 = normalize(ray_1.dir);
      vec3 tmpvar_370;
      tmpvar_370 = (ray_1.origin + (abs(
        dot ((spheres[0].xyz - ray_1.origin), tmpvar_369)
      ) * tmpvar_369));
      float tmpvar_371;
      tmpvar_371 = sqrt(dot (tmpvar_370, tmpvar_370));
      float tmpvar_372;
      vec3 x_373;
      x_373 = (tmpvar_19 - eye);
      tmpvar_372 = sqrt(dot (x_373, x_373));
      float tmpvar_374;
      vec3 x_375;
      x_375 = (spheres[0].xyz - eye);
      tmpvar_374 = sqrt(dot (x_375, x_375));
      if (((tmpvar_372 + spheres[0].w) < tmpvar_374)) {
        glowness_368 = vec3(0.0, 0.0, 0.0);
      } else {
        glowness_368 = (vec3(1.0, 0.95, 0.1) * clamp ((2.0 / 
          (0.5 + (tmpvar_371 * tmpvar_371))
        ), 0.0, 1.0));
      };
      color_14 = (color_14 + glowness_368);
    };
    if ((!(continueLoop_2) && (stackSize_5 > 0))) {
      int tmpvar_376;
      tmpvar_376 = (stackSize_5 - 1);
      stackSize_5 = tmpvar_376;
      ray_1 = stack_6[tmpvar_376].ray;
      bounceCount_4 = stack_6[tmpvar_376].depth;
      coeff_3 = stack_6[tmpvar_376].coeff;
      continueLoop_2 = bool(1);
    };
  };
  vec4 tmpvar_377;
  tmpvar_377.w = 1.0;
  tmpvar_377.x = color_14[colorModeInTernary[0]];
  tmpvar_377.y = color_14[colorModeInTernary[1]];
  tmpvar_377.z = color_14[colorModeInTernary[2]];
  gl_FragColor = tmpvar_377;
}