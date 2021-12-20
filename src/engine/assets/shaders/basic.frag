#version 300 es
precision highp float;

#define LIGHT_COUNT {{ lightCount }}

struct Light {
  vec3 position;
  vec3 colour;
};

struct Material {
  vec3  ambient;
  vec3  diffuse;
  vec3  specular;
  float shininess;
};

layout (std140) uniform Matrix {
  mat4 view;
  mat4 projection;
} m;

layout (std140) uniform LightSources {
  Light lights[LIGHT_COUNT];
};

uniform Material material;

in  vec3 pass_vertex_position;
in  vec3 pass_vertex_normal;

out vec4 out_colour;

void main()
{
  out_colour = vec4(0.0);

  vec3 V = normalize(-pass_vertex_position);
  vec3 N = normalize(pass_vertex_normal);

  for (int i=0; i<LIGHT_COUNT; i++)
  {
    vec3 light_pos = vec3(m.view * vec4(lights[i].position, 1.0));

    vec3 L = normalize(light_pos - pass_vertex_position);
    vec3 H = normalize(L + V);

    float d = length(L);
    float attenuation = 1.0/(1.0 + 0.1*d + 0.01*d*d);

    float kd = max(dot(N, L), 0.0);
    float ks = pow(max(dot(N, H), 0.0), material.shininess);

    vec3 ambient  =       lights[i].colour * material.ambient  * attenuation;
    vec3 diffuse  = kd  * lights[i].colour * material.diffuse  * attenuation;
    vec3 specular = ks  * lights[i].colour * material.specular * attenuation;

    out_colour += vec4(ambient + diffuse + specular, 1.0);
  }
}
