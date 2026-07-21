<script lang="ts">
  import { nanoid } from 'nanoid';

  let {
    value = $bindable(''),
    label,
    options = [],
    placeholder,
    disabled = false,
    ...rest
  }: {
    value?: string;
    label?: string;
    options: Array<{ value: string; label: string }>;
    placeholder?: string;
    disabled?: boolean;
  } = $props();

  const selectId = nanoid(8);
</script>

<div class="form-control w-full">
  {#if label}
    <label for={selectId} class="label">
      <span class="label-text">{label}</span>
    </label>
  {/if}
  <select
    id={selectId}
    {disabled}
    bind:value
    class="select select-bordered w-full"
    {...rest}
  >
    {#if placeholder}
      <option value="" disabled>{placeholder}</option>
    {/if}
    {#each options as opt}
      <option value={opt.value}>{opt.label}</option>
    {/each}
  </select>
</div>
