import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, StopCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { sendStreamRequest } from '@/lib/stream';
import { Streamdown } from 'streamdown';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: '你是一个专业的人力资源管理助手，可以帮助用户解答关于人事管理、劳动合同、员工管理等方面的问题。'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, streamingContent]);

  // 发送消息
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim()
    };

    // 添加用户消息
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setStreamingContent('');

    // 创建中断控制器
    abortControllerRef.current = new AbortController();

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      // 准备发送的消息（包括历史消息）
      const messagesToSend = [...messages, userMessage];

      await sendStreamRequest({
        functionUrl: `${supabaseUrl}/functions/v1/wenxin-chat`,
        requestBody: {
          messages: messagesToSend,
          enable_thinking: false
        },
        supabaseAnonKey,
        onData: (data) => {
          try {
            const parsed = JSON.parse(data);
            // 提取content内容
            const chunk = parsed.choices?.[0]?.delta?.content || '';
            if (chunk) {
              setStreamingContent(prev => prev + chunk);
            }
          } catch (e) {
            console.warn('解析数据失败:', e, data);
          }
        },
        onComplete: () => {
          // 将流式内容添加到消息列表
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: streamingContent
          }]);
          setStreamingContent('');
          setIsLoading(false);
        },
        onError: (error) => {
          console.error('请求失败:', error);
          toast.error('AI响应失败：' + error.message);
          setIsLoading(false);
          setStreamingContent('');
        },
        signal: abortControllerRef.current.signal
      });
    } catch (error) {
      console.error('发送消息失败:', error);
      toast.error('发送消息失败');
      setIsLoading(false);
      setStreamingContent('');
    }
  };

  // 停止生成
  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      
      // 保存已生成的内容
      if (streamingContent) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: streamingContent
        }]);
        setStreamingContent('');
      }
    }
  };

  // 清空对话
  const handleClear = () => {
    setMessages([
      {
        role: 'system',
        content: '你是一个专业的人力资源管理助手，可以帮助用户解答关于人事管理、劳动合同、员工管理等方面的问题。'
      }
    ]);
    setStreamingContent('');
    toast.success('对话已清空');
  };

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI助手</h1>
          <p className="text-muted-foreground mt-1">
            基于文心大模型的智能对话助手
          </p>
        </div>
        <Button variant="outline" onClick={handleClear}>
          清空对话
        </Button>
      </div>

      <Card className="h-[calc(100vh-280px)]">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            对话窗口
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex flex-col h-[calc(100%-80px)]">
          {/* 消息列表 */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            <div className="space-y-4">
              {messages.filter(m => m.role !== 'system').map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <Streamdown
                        parseIncompleteMarkdown={true}
                        isAnimating={false}
                      >
                        {message.content}
                      </Streamdown>
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* 流式输出中的消息 */}
              {streamingContent && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                    <Streamdown
                      parseIncompleteMarkdown={true}
                      isAnimating={true}
                    >
                      {streamingContent}
                    </Streamdown>
                  </div>
                </div>
              )}

              {/* 加载指示器 */}
              {isLoading && !streamingContent && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">AI正在思考...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* 输入区域 */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="输入消息... (Shift+Enter换行，Enter发送)"
                className="min-h-[60px] max-h-[200px] resize-none"
                disabled={isLoading}
              />
              <div className="flex flex-col gap-2">
                {isLoading ? (
                  <Button
                    onClick={handleStop}
                    variant="destructive"
                    size="icon"
                    className="h-[60px] w-[60px]"
                  >
                    <StopCircle className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    size="icon"
                    className="h-[60px] w-[60px]"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              提示：您可以询问关于人事管理、劳动合同、员工管理等方面的问题
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
