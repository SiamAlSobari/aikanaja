<script lang="ts">
  import { nanoid } from 'nanoid';

  let {
    value = $bindable(''),
    label,
    placeholder,
    rows = 4,
    error,
    disabled = false,
    ...rest
  }: {
    value?: string;
    label?: string;
    placeholder?: string;
    rows?: number;
    error?: string;
    disabled?: boolean;
  } = $props();

  const textareaId = nanoid(8);
</script>

<div class="form-control w-full">
  {#if label}
    <label for={textareaId} class="label">
      <span class="label-text">{label}</span>
    </label>
  {/if}
  <textarea
    id={textareaId}
    {placeholder}
    {rows}
    {disabled}
    bind:value
    class="textarea textarea-bordered w-full"
    class:textarea-error={!!error}
    {...rest}
  ></textarea>
  {#if error}
    <label class="label">
      <span class="label-text-alt text-error">{error}</span>
    </label>
  {/if}
</div>
