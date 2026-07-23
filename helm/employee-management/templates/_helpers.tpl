{{/*
Expand the name of the chart.
*/}}
{{- define "employee-management.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "employee-management.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "employee-management.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "employee-management.labels" -}}
helm.sh/chart: {{ include "employee-management.chart" . }}
{{ include "employee-management.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "employee-management.selectorLabels" -}}
app.kubernetes.io/name: {{ include "employee-management.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "employee-management.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "employee-management.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}


{{- define "employee-management.backend.name" -}}
{{ .Values.backend.name }}
{{- end -}}

{{- define "employee-management.postgres.name" -}}
{{ .Values.postgres.name }}
{{- end -}}

{{/*
Backend Full Name
*/}}
{{- define "employee-management.backend.fullname" -}}
{{ printf "%s-%s" .Release.Name .Values.backend.name }}
{{- end -}}

{{/*
Postgres Full Name
*/}}
{{- define "employee-management.postgres.fullname" -}}
{{ printf "%s-%s" .Release.Name .Values.postgres.name }}
{{- end -}}