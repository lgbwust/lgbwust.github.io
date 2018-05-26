---
layout: post
title: spring boot配置动态数据源
categories: [java,微服务]
tags: code
---

> 总结

在实际的应用开发中，我们通常会遇到多数据源的问题，以下是配置动态数据源的方法

```java
package com.datasource;

import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;

/**
 * @author lgb
 * @create 2018-05-22 11:14
 * @desc 动态数据源
 **/
public class DynamicDataSource extends AbstractRoutingDataSource {

    @Override
    protected Object determineCurrentLookupKey() {
        return DynamicDataSourceContextHolder.getDataSourceType();
    }

}

```

```java
package com.datasource;

import java.util.ArrayList;
import java.util.List;

/**
 * @author lgb
 * @create 2018-05-22 11:15
 * @desc 动态数据源配置
 **/
public class DynamicDataSourceContextHolder {

    private static final ThreadLocal<String> contextHolder = new ThreadLocal<>();
    public static List<String> dataSourceIds = new ArrayList<>();

    public static void setDataSourceType(String dataSourceType) {
        contextHolder.set(dataSourceType);
    }

    public static String getDataSourceType() {
        return contextHolder.get();
    }

    public static void clearDataSourceType() {
        contextHolder.remove();
    }

    /**
     * 判断指定DataSrouce当前是否存在
     *
     * @param dataSourceId
     * @return
     */
    public static boolean containsDataSource(String dataSourceId) {
        return dataSourceIds.contains(dataSourceId);
    }
}

```

```java
package com.datasource;

import java.util.HashMap;
import java.util.Map;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.MutablePropertyValues;
import org.springframework.beans.PropertyValues;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.beans.factory.support.GenericBeanDefinition;
import org.springframework.boot.autoconfigure.jdbc.DataSourceBuilder;
import org.springframework.boot.bind.RelaxedDataBinder;
import org.springframework.boot.bind.RelaxedPropertyResolver;
import org.springframework.context.EnvironmentAware;
import org.springframework.context.annotation.ImportBeanDefinitionRegistrar;
import org.springframework.core.convert.ConversionService;
import org.springframework.core.convert.support.DefaultConversionService;
import org.springframework.core.env.Environment;
import org.springframework.core.type.AnnotationMetadata;

/**
 * @author lgb
 * @create 2018-05-22 11:17
 * @desc 动态数据源注册
 **/
public class DynamicDataSourceRegister
        implements ImportBeanDefinitionRegistrar, EnvironmentAware {

    private static final Logger logger = LoggerFactory.getLogger(DynamicDataSourceRegister.class);
    private ConversionService conversionService = new DefaultConversionService();
    private PropertyValues dataSourcePropertyValues;

    // 如配置文件中未指定数据源类型，使用该默认值
    //private static final Object DATASOURCE_TYPE_DEFAULT = "org.apache.tomcat.jdbc.pool.DataSource";
    private static final String DATASOURCE_TYPE_DEFAULT = "com.zaxxer.hikari.HikariDataSource";


    // 数据源
    private DataSource defaultDataSource;
    private String dataSourceKey = null;
    private Map<String, DataSource> customDataSources = new HashMap<>();

    @Override
    public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, BeanDefinitionRegistry registry) {
        Map<Object, Object> targetDataSources = new HashMap<Object, Object>();
        // 将主数据源添加到更多数据源中
        targetDataSources.put(dataSourceKey, defaultDataSource);
        DynamicDataSourceContextHolder.dataSourceIds.add(dataSourceKey);
        // 添加更多数据源
        targetDataSources.putAll(customDataSources);
        for (String key : customDataSources.keySet()) {
            DynamicDataSourceContextHolder.dataSourceIds.add(key);
        }

        // 创建DynamicDataSource
        GenericBeanDefinition beanDefinition = new GenericBeanDefinition();
        beanDefinition.setBeanClass(DynamicDataSource.class);
        beanDefinition.setSynthetic(true);
        MutablePropertyValues mpv = beanDefinition.getPropertyValues();
        mpv.addPropertyValue("defaultTargetDataSource", defaultDataSource);
        mpv.addPropertyValue("targetDataSources", targetDataSources);
        registry.registerBeanDefinition("dataSource", beanDefinition);

        logger.info("Dynamic DataSource Registry");
    }

    /**
     * 创建DataSource
     *
     * @param dsMap
     * @return
     */
    public DataSource buildDataSource(Map<String, Object> dsMap) {
        try {
            Object type = dsMap.get("type");
            if (type == null)
                type = DATASOURCE_TYPE_DEFAULT;// 默认DataSource

            Class<? extends DataSource> dataSourceType;
            dataSourceType = (Class<? extends DataSource>) Class.forName((String) type);

            String driverClassName = dsMap.get("driver-class-name").toString();
            String url = dsMap.get("url").toString();
            String username = dsMap.get("username").toString();
            String password = dsMap.get("password").toString();

            DataSourceBuilder factory = DataSourceBuilder.create().driverClassName(driverClassName).url(url)
                    .username(username).password(password).type(dataSourceType);
            return factory.build();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        return null;
    }


    /**
     * 加载多数据源配置
     */
    @Override
    public void setEnvironment(Environment env) {
        initDefaultDataSource(env);
        initCustomDataSources(env);
    }

    /**
     * 初始化主数据源
     */
    private void initDefaultDataSource(Environment env) {
        // 读取主数据源
        RelaxedPropertyResolver propertyResolver = new RelaxedPropertyResolver(env, "spring.datasource.");
        Map<String, Object> dsMap = new HashMap<>();
        dsMap.put("type", propertyResolver.getProperty("type"));
        dsMap.put("driver-class-name", propertyResolver.getProperty("driver-class-name"));
        dsMap.put("url", propertyResolver.getProperty("url"));
        dsMap.put("username", propertyResolver.getProperty("username"));
        dsMap.put("password", propertyResolver.getProperty("password"));

        defaultDataSource = buildDataSource(dsMap);
        dataSourceKey = propertyResolver.getProperty("name");
        dataBinder(defaultDataSource, env);

    }

    /**
     * 为DataSource绑定更多数据
     *
     * @param dataSource
     * @param env
     */
    private void dataBinder(DataSource dataSource, Environment env) {
        RelaxedDataBinder dataBinder = new RelaxedDataBinder(dataSource);
        //dataBinder.setValidator(new LocalValidatorFactory().run(this.applicationContext));
        dataBinder.setConversionService(conversionService);
        dataBinder.setIgnoreNestedProperties(false);//false
        dataBinder.setIgnoreInvalidFields(false);//false
        dataBinder.setIgnoreUnknownFields(true);//true
        if (dataSourcePropertyValues == null) {
            Map<String, Object> rpr = new RelaxedPropertyResolver(env, "spring.datasource").getSubProperties(".");
            Map<String, Object> values = new HashMap<>();
            // 排除已经设置的属性
            values.remove("type");
            values.remove("driver-class-name");
            values.remove("url");
            values.remove("username");
            values.remove("password");
            dataSourcePropertyValues = new MutablePropertyValues(values);
        }
        dataBinder.bind(dataSourcePropertyValues);
    }


    /**
     * 初始化更多数据源
     */
    private void initCustomDataSources(Environment env) {
        // 读取配置文件获取更多数据源，也可以通过defaultDataSource读取数据库获取更多数据源
        RelaxedPropertyResolver propertyResolver = new RelaxedPropertyResolver(env, "custom.datasource.");
        String dsPrefixs = propertyResolver.getProperty("names");
        if (dsPrefixs != null) {//判断是否存在
            for (String dsPrefix : dsPrefixs.split(",")) {// 多个数据源
                Map<String, Object> dsMap = propertyResolver.getSubProperties(dsPrefix + ".");
                DataSource ds = buildDataSource(dsMap);
                customDataSources.put(dsPrefix, ds);
                dataBinder(ds, env);
            }
        }

    }

}

```

```java
package com.datasource;

import java.lang.annotation.*;

/**
 * @author lgb
 * @create 2018-05-22 11:19
 * @desc 标记是动态选择数据源
 **/
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface EnableDynamicDataSource {
}

```

```java
package com.exception;

import com.alibaba.fastjson.JSONException;
import com.datasource.DynamicDataSourceContextHolder;
import com.datasource.EnableDynamicDataSource;
import com.entity.ResponseData;
import com.util.Constant;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.sql.SQLException;
import java.sql.SQLSyntaxErrorException;

/**
 * @author lgb
 * @create 2018-05-22 11:32
 * @desc 定义一个切面，统一捕捉service层Exception
 **/
@Aspect
@Order(-1)// 保证该AOP在@Transactional之前执行
@Component
public class ServiceExceptionAspect {
    private static final Log logger = LogFactory.getLog(ServiceExceptionAspect.class);

    /**
     * 定义切点Pointcut于service注解的方法
     */
    @Pointcut("@within(org.springframework.stereotype.Service)")
    public void servicePointcut() {
    }

    /**
     * 定义切点Pointcut于UI控制层
     */
    @Pointcut(Constant.UI_ASPECT)
    public void uiPointcut() {
    }

    /**
     * service捕捉到异常向上抛出
     *
     * @param e
     */
    @AfterThrowing(value = "servicePointcut()", throwing = "e")
    public void afterServiceThrowing(JoinPoint point, Exception e) throws Throwable {
        logger.info(e);
        //错误直接抛出
        throw e;

    }

    /**
     * service捕捉到异常向上抛出@annotation(ds)
     *
     * @param point
     * @param point
     */
    @Before(value = "@annotation(ds)")
    public void changeDataSource(JoinPoint point, EnableDynamicDataSource ds) throws Throwable {
        Object[] obj = point.getArgs();

        logger.debug("判断数据源是否存在:" + DynamicDataSourceContextHolder.containsDataSource(obj[0].toString()));
        if (!DynamicDataSourceContextHolder.containsDataSource(obj[0].toString())) {
            logger.error("数据源[{" + obj[0].toString() + "}]不存在，使用默认数据源 > {" + point.getSignature() + "}");
            //logger.debug("动态生成并使用数据源 : {"+dynamicBean.getDataSourceName()+"} > {"+point.getSignature()+"}");
            //DynamicDataSourceRegister.initCustomDataSources(registry,env,dynamicBean);
        } else {
            logger.debug("使用数据源 : {" + obj[0].toString() + "} > {" + point.getSignature() + "}");
            DynamicDataSourceContextHolder.setDataSourceType(obj[0].toString());
        }

    }

    @After(value = "@annotation(ds)")
    public void restoreDataSource(JoinPoint point, EnableDynamicDataSource ds) {
        Object[] obj = point.getArgs();
        logger.debug("重置数据源: {" + obj[0].toString() + "} > {" + point.getSignature() + "}");
        DynamicDataSourceContextHolder.clearDataSourceType();
    }

    /**
     * 捕捉servive层抛出的异常以及controller层执行过程中出现的异常
     *
     * @param proceedingJoinPoint
     * @throws
     */
    @Around(value = "uiPointcut()")
    public Object around(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
        logger.debug("UI Aspect around");
        Object result = null;
        try {
            result = proceedingJoinPoint.proceed();
        } catch (Throwable e) {
            ResponseData resp = new ResponseData(); //返回结构
            Throwable ex = e;
            while (ex.getCause() != null) {
                ex = ex.getCause();
            }
            if (ex instanceof BusinessAccessException || ex instanceof UnLoginException) {
                resp.setCode(Constant.LOGIN_TIMEOUT);
                resp.setMsg("登录超时");
            } else if (ex instanceof JSONException) {
                resp.setCode(Constant.JSON_FORMAT_EXCEPTION);
                resp.setMsg("JSON数据有误");

            } else if (ex instanceof InvocationTargetException) {//反射异常

                resp.setCode(Constant.SQL_SENTANCE_EXCEPTION);
                resp.setMsg("异常信息：" + e.getMessage());

            } else if (ex instanceof SQLSyntaxErrorException) {

                resp.setCode(Constant.SQL_SENTANCE_EXCEPTION);
                resp.setMsg("SQL语句不正确");

            } else if (ex instanceof SQLException) {

                String errorMessage = ex.getMessage();
                //oracle错误码
                if (errorMessage.contains("ORA-00001")) {
                    resp.setCode(Constant.UNIQUE_INDEX_ERROR);
                    resp.setMsg("唯一性索引错误");

                } else if (errorMessage.contains("ORA-00100")) { //未找到数据
                    resp.setCode(Constant.NON_EXISTENT_EXCEPTION);
                    resp.setMsg("数据表中不存在记录");

                } else if (errorMessage.contains("ORA-00001")) {
                    resp.setCode(Constant.UNSUPPORTED_UPDATE_EXCEPTION);
                    resp.setMsg("记录或字段值不支持修改");

                } else if (errorMessage.contains("ORA-00990")) {
                    resp.setCode(Constant.UNSUPPORTED_BATCH_DELETE_EXCEPTION);
                    resp.setMsg("总线服务端不支持批量删除");

                } else if (errorMessage.contains("ORA-00990")) {
                    resp.setCode(Constant.BATCH_DELETE_PARTFAILURE_EXCEPTION);
                    resp.setMsg("批量删除部分失败，部分成功");

                } else if (errorMessage.contains("ORA-02449")) {
                    resp.setCode(Constant.DELETE_EXCEPTION);
                    resp.setMsg("删除异常");

                } else {
                    resp.setCode(Constant.RETURN_FAILURE);
                    resp.setMsg("异常信息：" + errorMessage);

                }
            } else if (ex instanceof IllegalArgumentException) {
                resp.setCode(Constant.PROTOCOL_PARAMETER_ERROR);
                resp.setMsg("协议参数错误，如必填的参数字段没填等");

            } else if (ex instanceof IllegalAccessException) {
                resp.setCode(Constant.OPERATION_AUTHORITY_EXCEPTION);
                resp.setMsg("没有操作权限");

            } else if (ex instanceof NullPointerException) {
                resp.setCode(Constant.RETURN_FAILURE);
                resp.setMsg("空指针" + e.getMessage());

            } else if (ex instanceof ClassNotFoundException) {
                resp.setCode(Constant.RETURN_FAILURE);
                resp.setMsg("指定的类不存在");

            } else if (ex instanceof ClassCastException) {
                resp.setCode(Constant.RETURN_FAILURE);
                resp.setMsg("数据类型转换异常");

            } else if (ex instanceof SecurityException) {
                resp.setCode(Constant.RETURN_FAILURE);
                resp.setMsg("安全异常");

            } else if (ex instanceof IOException) {
                resp.setCode(Constant.RETURN_FAILURE);
                resp.setMsg("输入输出异常");

            } else if (ex instanceof Exception) {
                resp.setCode(Constant.RETURN_FAILURE);
                resp.setMsg("异常信息：" + ex.getMessage());
            }
            return resp;
        }
        return result;
    }
}

```
