import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import App from './App.vue';
import axios from 'axios';

// Mock axios and alert
vi.mock('axios');
global.alert = vi.fn();
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('App.vue Canvas', () => {
    it('renders sidebar and VueFlow', () => {
        const wrapper = mount(App);
        expect(wrapper.text()).toContain('NTST System');
        expect(wrapper.text()).toContain('節點設定');
        expect(wrapper.find('.vue-flow-wrapper').exists()).toBe(true);
    });

    it('exports flow successfully', async () => {
        const wrapper = mount(App);
        const button = wrapper.find('button');
        
        (axios.post as any).mockResolvedValue({ data: { success: true } });
        
        await button.trigger('click');
        
        await new Promise(r => setTimeout(r, 100));
        
        expect(axios.post).toHaveBeenCalledWith('/api/workflows', expect.objectContaining({
            name: 'My Local Workflow',
            nodes: expect.any(Array),
            edges: expect.any(Array)
        }));
        
        expect(global.alert).toHaveBeenCalledWith('已成功匯出流程至後端 SQLite！');
    });
});
