<script lang="ts">
  import { nanoid } from 'nanoid';

  let {
    value = $bindable(''),
    label,
    placeholder,
    type = 'text',
    error,
    disabled = false,
    icon,
    ...rest
  }: {
    value?: string;
    label?: string;
    placeholder?: string;
    type?: string;
    error?: string;
    disabled?: boolean;
    icon?: string;
  } = $props();

  const inputId = nanoid(8);
</script>

<div class="form-control w-full">
  {#if label}
    <label for={inputId} class="label">
      <span class="label-text">{label}</span>
    </label>
  {/if}
  <div class="relative">
    {#if icon}
      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50">
        {icon}
      </span>
    {/if}
    <input
      id={inputId}
      {type}
      {placeholder}
      {disabled}
      bind:value
      class="input input-bordered w-full"
      class:input-error={!!error}
      class:pl-10={!!icon}
      {...rest}
    />
  </div>
  {#if error}
    <label class="label">
      <span class="label-text-alt text-error">{error}</span>
    </label>
  {/if}
</div>
